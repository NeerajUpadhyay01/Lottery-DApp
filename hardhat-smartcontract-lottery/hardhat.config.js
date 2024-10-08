require("@nomicfoundation/hardhat-chai-matchers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.8",
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        nuColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    etherscan:{
        apiKey: ETHERSCAN_API_KEY
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha:{
        timeout: 500000   // 500 seconds max
    }
}
