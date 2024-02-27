import React from "react";
import "./Login.css"
const Login = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">Coin Generator </h1>
            <h2>With Staking</h2>
            <button onClick={props.connectWallet}>Connect Metamask</button>



        </div>







    )

}

export default Login;
