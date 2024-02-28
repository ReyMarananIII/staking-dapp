import React, { useState, useEffect } from 'react';
import './Connected.css';

const Connected = (props) => {
    const [stakeAmount, setStakeAmount] = useState(null);
    const [inputStakeAmount, setInputStakeAmount] = useState('');
    const [ownerBalance, setOwnerBalance] = useState(null);

    const updateBalanceAmount = async () => {
        try {
            const currBal = await props.getBalance();
            setOwnerBalance(currBal);
        } catch (error) {
            console.error("Error fetching owner balance", error);
        }
    };

    const updateStakeAmount = async () => {
        try {
            const stakeAmount = await props.getStake();
            setStakeAmount(stakeAmount);
        } catch (error) {
            console.error("Error fetching stake amount:", error);
        }
    };

    const handleStakeInputChange = (e) => {
        setInputStakeAmount(e.target.value);
    };

    const handleStakeCoin = async () => {
        try {
            await props.stakeCoin(inputStakeAmount);
            updateStakeAmount();
        } catch (error) {
            console.error("Error staking coins:", error);
        }
    };

    
    useEffect(() => {
        const balanceUpdateInterval = setInterval(updateBalanceAmount, 5000); 

        
        return () => clearInterval(balanceUpdateInterval);
    }, []); 

    return (
        <div className="connected-container">
            <h1>Olympus (OLY)</h1>
            <h1 className="welcome-message">Coin Generator</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p>Current Balance: {ownerBalance}</p>
            
            <button onClick={props.mintCoin}>Mint 1 Oly Coin</button>
            <button onClick={handleStakeCoin}>Stake Coin</button>
            <input
                type="number"
                placeholder="Enter Stake Amount"
                value={inputStakeAmount}
                onChange={handleStakeInputChange}
            />
            <button onClick={updateStakeAmount}>Show Stake</button>
            <button onClick={props.withdrawCoin}>Withdraw</button>

            {stakeAmount !== null && (
                <p className="stake-amount">Stake Amount: {stakeAmount+ " Oly"}</p>
            )}
        </div>
    );
};

export default Connected;