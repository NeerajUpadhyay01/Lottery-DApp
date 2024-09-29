import React, { useEffect } from 'react'

function CustomError({error}) {
  useEffect(() => {
    if (error) {
      const errorElement = document.getElementById("error");
      errorElement.style.animation = "fadeIn .2s forwards ease-in-out";

      const timer = setTimeout(() => {
        errorElement.style.animation = "fadeOut .2s forwards ease-in-out";
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div id="error">
        <p>{error}</p>
    </div>
  )
}

export default CustomError