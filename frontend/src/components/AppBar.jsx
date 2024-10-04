import { useEffect } from "react";
import { Link } from "react-router-dom"
import Web3 from "web3";
// Existing token --> TokenA
import { ExistingTokenABI } from "../abis/ExistingToken";
// Token --> TokenB
import { TokenABI } from "../abis/Token";

import { TokenSwapABI } from "../abis/TokenSwap";

export default function AppBar({web3, setWeb3, account, setAccount,
    tokenAContract, setTokenAContract,
    tokenBContract, setTokenBContract,
    swapContract, setSwapContract,
    tokenAContractAddress,
    tokenBContractAddress,
    swapContractAddress
}) {

    function shortenAddress(address) {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    useEffect(()=>{
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    const web3Instance = new Web3(window.ethereum);
                    console.log("web3 from app",web3Instance);
                    setWeb3(web3Instance);
                    web3Instance.eth.getAccounts()
                    .then(accounts => {
                        setAccount(accounts[0]);
    
                        const TokenAInstance = new web3Instance.eth.Contract(ExistingTokenABI, tokenAContractAddress);
                        setTokenAContract(TokenAInstance);
        
                        // Setting Token B
                        const TokenBInstance = new web3Instance.eth.Contract(TokenABI, tokenBContractAddress)
                        setTokenBContract(TokenBInstance)
        
                        const SwapContractInstance = new web3Instance.eth.Contract(TokenSwapABI, swapContractAddress)
                        setSwapContract(SwapContractInstance)
    
                    }).catch(err=>{
                        console.log("error fetching accounts");
                    })
                    // Setting Token A
                })
                // Get the contract details and then access the methods as needed 
                .catch(err => {
                    // Handle error if the user rejects the connection request
                    console.error(err);
                });
        } else {
            alert('Please install an another Ethereum wallet.');
        }
    },[])
    async function handleOnclick(){
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    const web3Instance = new Web3(window.ethereum);
                    
                    setWeb3(web3Instance);
                    web3Instance.eth.getAccounts()
                    .then(accounts => {
                        setAccount(accounts[0]);
                        const TokenAInstance = new web3Instance.eth.Contract(ExistingTokenABI, tokenAContractAddress);
                       setTokenAContract(TokenAInstance);
    
                         // Setting Token B
                        const TokenBInstance = new web3Instance.eth.Contract(TokenABI, tokenBContractAddress)
                        setTokenBContract(TokenBInstance)
    
                        const SwapContractInstance = new web3Instance.eth.Contract(TokenSwapABI, swapContractAddress)
                        setSwapContract(SwapContractInstance)
                    }).catch(err=>{
                        console.log("error fetching accounts");
                    })
                })
                .catch(err => {
                    // Handle error if the user rejects the connection request
                    console.error(err);
                });
        } else {
            alert('Please install an another Ethereum wallet.');
        }
    }
    return (
        <div className="text-white p-2 py-3 border-b-gray-500 border-b flex justify-between">
            <Link to={"/"} className="text-2xl font-heading">DEX</Link>
        <div className="flex flex-col justify-center">
            <div className="flex justify-center">
                <Link to={"/"} className="px-2">Swap Tokens</Link>
                <Link to={"/transactions"} className="px-2">Transactions</Link>
                <div>
                    {account ? <div className="bg-primary-300 px-2 rounded-xl text-black">{shortenAddress(account)}</div> : 
                <div className="bg-primary-300 px-2 rounded-xl text-black cursor-pointer" onClick={handleOnclick}>Connect to Wallet</div>
                    }
                </div>

            </div>
        </div>
        </div>
    )
}