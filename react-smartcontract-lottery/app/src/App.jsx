import "./App.css";
import { contractAddress, abi } from "../constants";
import { Block, ethers } from "../ethers-6.7.min.js";
import { useEffect, useState } from "react";
import Counter from "./Counter.jsx";
import CustomError from "./CustomError.jsx";

function App() {
  const [contract, setContract] = useState(null);
  const [raffleDetails, setRaffleDetails] = useState({
    entranceFee: "",
    interval: "",
    numberOfPlayers: "",
    raffleState: "",
    recentWinner: "",
    refresh: false,
    isConnected: false,
    ethAmount: "",
    error: "",
  });

  // setInterval(()=>{
  //   setRaffleDetails(prevData => ({...prevData,refresh: !raffleDetails.refresh}))
  // },[raffleDetails.interval])

  useEffect(() => {
    async function getRaffleDetails() {
      const entranceFee = await contract.getEntranceFee();
      const interval = await contract.getInterval();
      const players = await contract.getNumberOfPlayers();
      const raffleState = await contract.getRaffleState();
      const winner = await contract.getRecentWinner();
      setRaffleDetails((prevData) => ({
        ...prevData,
        entranceFee: entranceFee.toString(),
        interval: interval.toString(),
        numberOfPlayers: players.toString(),
        raffleState: raffleState.toString(),
        recentWinner: winner.toString(),
      }));
    }
    if (contract) {
      getRaffleDetails();
    }
  }, [
    raffleDetails.raffleState,
    raffleDetails.recentWinner,
    raffleDetails.numberOfPlayers,
    raffleDetails.refresh,
    contract,
  ]);

  function handleChange() {
    setRaffleDetails((prevData) => ({
      ...prevData,
      ethAmount: event.target.value,
    }));
  }

  async function enterRaffle() {
    try {
      if (contract === null) {
        throw new Error("Metamask is not connected!");
      }
      if(raffleDetails.raffleState === "1"){
        throw new Error("Wait for the raffle to open again!");
      }
      if (raffleDetails.ethAmount < 0.01) {
        throw new Error("ETH is not enough!");
      }
      const transactionResponse = await contract.enterRaffle({
        value: ethers.parseEther(raffleDetails.ethAmount),
      });

      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
      document.getElementById("ethAmount").value = "";
    } catch (error) {
      setRaffleDetails((prevData) => ({ ...prevData, error: "" }));
      setTimeout(() => {
        const errorMessage =
          error.reason || error.message || "Unknown error occurred";
        setRaffleDetails((prevData) => ({ ...prevData, error: errorMessage }));
      }, 0);
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, async (transactionReceipt) => {
        console.log(
          `Completed with ${await transactionReceipt.confirmations()} confirmations`
        );
      });
      resolve();
    });
  }

  async function connect() {
    let account;
    try {
      if (typeof window.ethereum !== undefined) {
        account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } else {
        throw new Error("Please install metamask!");
      }

      if (account) {
        connectButton.style.letterSpacing = "1.1px";
        connectButton.style.cursor = "text";
        connectButton.innerHTML = `${account
          .toString()
          .slice(0, 6)}.....${account.toString().slice(36, 42)}`;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
        setRaffleDetails((prevData) => ({
          ...prevData,
          isConnected: !raffleDetails.isConnected,
        }));
      }
    } catch (error) {
       setRaffleDetails((prevData) => ({ ...prevData, error: "" }));
       setTimeout(() => {
         const errorMessage =
           error.reason || error.message || "Unknown error occurred";
         setRaffleDetails((prevData) => ({ ...prevData, error: errorMessage }));
       }, 0);
    }
  }

  

  return (
    <>
      <h1 data-content="Lottery DApp">Lottery DApp</h1>
      <button
        id="connectButton"
        className={raffleDetails.isConnected ? "" : "animate"}
        onClick={connect}
      >
        Connect Metamask
      </button>
      <div className="container">
        <span id="enterRaffle">
          <input
            type="text"
            id="ETHAmount"
            placeholder="0.1"
            name="ethAmount"
            value={raffleDetails.ethAmount}
            onChange={handleChange}
          />
          <button id="enterRaffleButton" onClick={enterRaffle}>
            Enter Raffle
          </button>
        </span>
        <h3 id="players">
          Total Players: {raffleDetails.numberOfPlayers || "N/A"}
        </h3>
        <h3 id="entranceFee">
          Entrance Fee:{" "}
          {!raffleDetails.entranceFee
            ? "N/A"
            : `${raffleDetails.entranceFee / 1e18} ETH`}
        </h3>
        <h3 id="raffleState">
          Raffle: {raffleDetails.raffleState === "0" ? "OPEN" : "CLOSED"}
        </h3>
      </div>
      <h3 id="winner">Recent Winner: {raffleDetails.recentWinner || "N/A"} </h3>
      <img src="./timer.webp" id="timer" alt="" />
      {raffleDetails.interval && <Counter interval={raffleDetails.interval} />}
      {raffleDetails.error && <CustomError error={raffleDetails.error} />}
    </>
  );
}

export default App;
