import {useState,useEffect} from 'react';
import {ethers} from 'ethers';
import {contractABI,contractAddress} from './Constant/constant';
import Login from './Component/Login';
import './App.css';
import Connected from './Component/Connected';
import { parseUnits } from 'ethers/lib/utils';


function App() {
    const[provider,setProvider] = useState(null);
    const[accounts,setAccount] = useState(null);
    const[isConnected,setIsConnected] = useState(false);



    async function mintCoin ( ) {
      try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer=provider.getSigner()
      const contractInstance= new ethers.Contract(
        contractAddress,contractABI,signer

      );

      const address = await signer.getAddress();
      setAccount(address);
      
      const amountToMint = ethers.utils.parseUnits("1",18);
      const transaction = await contractInstance.connect(signer).mint(address, amountToMint);
      await transaction.wait();
    }catch(err){
      console.error(err);
    }
    }



    async function stakeCoin(stakeAmounts) {
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
              contractAddress, contractABI, signer
          );
  
          const address = await signer.getAddress();
          setAccount(address);
  
          const stakeAmount = ethers.utils.parseUnits(stakeAmounts.toString(),18);
          await contractInstance.stake(stakeAmount);
      } catch (err) {
          console.error(err);
      }
  }

    async function getStake() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
          contractAddress, contractABI, signer
      );
  
      const address = await signer.getAddress();
      setAccount(address);
  
      
      const stakeAmount = await contractInstance.getStake(address);
  
      
      
      const formattedStakeAmount = ethers.utils.formatEther(stakeAmount);
      console.log(formattedStakeAmount);
      return formattedStakeAmount;
  }

  async function withdrawCoin() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const owner = await signer.getAddress();
  
      const OlyContract = new ethers.Contract(
        contractAddress, contractABI, signer
      );
  
      const initialBalance = await OlyContract.balanceOf(owner);
      console.log("Initial Balance: ", ethers.utils.formatEther(initialBalance));
  
      const stakedBalance = await OlyContract.getStake(owner);
      const stakedbalance = ethers.utils.parseUnits(stakedBalance.toString(),18);
      console.log("Current staked balance", ethers.utils.formatEther(stakedBalance));
  
      
      const withdrawTransaction = await OlyContract.connect(signer).withdraw();
      await withdrawTransaction.wait();
  
      const stakedBalanceWithdrawal = await OlyContract.getStake(owner);
      console.log("Withdrawal successful. Staked balance after withdrawal: ", stakedBalanceWithdrawal.toString());
  
      
      await OlyContract.provider.waitForTransaction(withdrawTransaction.hash);
  
      
      const finalBalance = await OlyContract.balanceOf(owner);
      console.log("Final balance after withdrawal", ethers.utils.formatEther(finalBalance));
    } catch (err) {
      console.error(err);
    }
  }

  async function getBalance() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const owner = await signer.getAddress();

        const OlyContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        
        const balanceInWei = await OlyContract.balanceOf(owner);

        
       
        const balance = ethers.utils.formatUnits(balanceInWei, 18);
        console.log(balance);
        return balance;
    } catch (error) {
        console.error(error);
    }
}




    













    async function connectToMetamask(){
      if (window.ethereum){
        try{
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider)
          await provider.send ("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          console.log("Metamask connected" + address);
          setIsConnected(true);
        } catch (err){
          console.error(err);
        }




      }else{
        console.error("Metamask not detected");
      }





    }




  return (
    <div className="App">
      {isConnected ? 
      (<Connected account ={accounts}
       mintCoin={mintCoin}
       stakeCoin={stakeCoin}
       getStake={getStake}
       withdrawCoin={withdrawCoin}
       getBalance= {getBalance}

       
       
       />): 
       
       (<Login connectWallet = {connectToMetamask}/>)}
      
    </div>
  );
}

export default App;
