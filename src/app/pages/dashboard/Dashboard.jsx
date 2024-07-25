import styles from '../../../../styles/Home.module.css';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import { connectWallet } from "../../utils/ConnectWallet";
// import Link from 'next/link';
import { ethers } from "ethers";
import { useContext } from "react";
import Web3Context from "../../context/Web3Context";
import TokenApproval from '../TokenApproval/TokenApproval';




export default function Home() {


    const [walletAddress, setWalletAddress] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [walletSymbol, setWalletSymbol] = useState(null);
    const { TimelockContract, selectedAccount } = useContext(Web3Context);
    const depositAmountRef = useRef();
    const withdrawAmountRef = useRef();
    const [balanceVal, setBalanceVal]= useState('0');
  
  
    useEffect(() => {
      const fetchBalanceInfo = async () => {
        try {
          const balanceValueWei = await TimelockContract.manualBalances(selectedAccount);
          const balanceValueEth = ethers.formatUnits(balanceValueWei,18).toString();
          const roundedBalance = parseFloat(balanceValueEth).toFixed(2)
          setBalanceVal(roundedBalance)
          
        } catch (error) {
          console.error(error.message)
        }
      }
      const interval = setInterval(() => {
        TimelockContract && fetchBalanceInfo();
      }, 2000)
      return () => clearInterval(interval)
    }, [TimelockContract, selectedAccount])
    
  
    const depositToken = async (e) => {
      e.preventDefault();
      const amount = depositAmountRef.current.value.trim();
  
      if (isNaN(amount) || amount <= 0) {
        console.error("Please enter a valid positive number");
  
        return;
      }
  
      const amountToDeposit = ethers.parseUnits(amount, 18).toString();
      try {
        const transaction = await TimelockContract.deposit(amountToDeposit);
        console.log(transaction);
  
        depositAmountRef.current.value = "";
      } catch (error) {
        console.error(error.message);
      }
    };
    const withdrawToken = async (e) => {
      e.preventDefault();
      const amount = withdrawAmountRef.current.value.trim();
  
      if (isNaN(amount) || amount <= 0) {
        console.error("Please enter a valid positive number");
  
        return;
      }
  
      const amountToWithdraw = ethers.parseUnits(amount, 18).toString();
      try {
        const transaction = await TimelockContract.withdraw(amountToWithdraw);
        console.log(transaction);
  
        withdrawAmountRef.current.value = "";
      } catch (error) {
        console.error(error.message);
      }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletData = await connectWallet();
                setWalletAddress(walletData.selectedAccount);

                setWalletBalance(walletData.balanceInWei);
                setWalletSymbol(walletData.symbol);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        };

        fetchData();
    }, []);


    //RenderThisIfConnected
    const renderConnected = () => {
        return (
            <>
                <strong>Wallet Address {walletAddress}</strong>
                <strong className='mb-5'>Total Balance Wallet : {walletBalance} {walletSymbol}{" "}</strong>
                <TokenApproval/>
                <div className="innerBox">
                    <form className='grid mr-10' onSubmit={depositToken}>
                        <label>
                            Deposit :
                            <input
                                id="deposit"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder='Amount Of LSK'
                                class="px-2 py-1 border border-gray-300 rounded mr-2 my-3"
                                ref={depositAmountRef}

                            >
                            </input>
                        </label>
                        <button
                            className="border-gray-500 border-2 my-3 ml-2 p-1 mt-2 px-2 py-2"
                            onClick={depositToken}
                        >
                            Deposit
                        </button>
                    </form>
                    <form onSubmit={withdrawToken}>
                        <div>
                            <label htmlFor="">Amount to withdraw:</label>
                            <input
                                ref={withdrawAmountRef}
                                type="text"
                                placeholder="Enter amount"
                                class="px-2 py-1 border border-gray-300 rounded mr-2 my-3"

                            />
                        </div>
                        <button
                             className="border-gray-500 border-2 my-3 ml-2 p-1 mt-2 px-2 py-2"
                             onClick={withdrawToken}
                        >
                        Withdraw
                        </button>
                    </form>
                    <p className='mt-3 ml-3'> Savings Balance: {balanceVal}</p>
                </div>

            </>
        )

    }






    return (
        <>
            <div className="container">
                <div className="flexBox">
                    <h1 className='text-xl font-bold mb-5 mt-20'>Welcome Crystal!!</h1>
                    Come Drop Off YOUR CRYPTO
                    <Image className='my-5' src="/lockImg.jpg" alt='chestimage' width={200} height={200}></Image>
                    {renderConnected()}
                </div>


            </div>

        </>
    )
}