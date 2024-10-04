import { useState, useEffect} from "react";
import Web3 from "web3";
import { ExistingTokenABI } from "../abis/ExistingToken";
// Token --> TokenB
import { TokenABI } from "../abis/Token";

import { TokenSwapABI } from "../abis/TokenSwap";
// Currently supporting only ether, TokenA, TokenB
export default function Swap({
    tokenAContractAddress, tokenBContractAddress, swapContractAddress
}){
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [tokenAContract, setTokenAContract] = useState(null);
    const [tokenBContract, setTokenBContract] = useState(null);
    const [swapContract, setSwapContract] = useState(null);

    const [rate , setRate] = useState(0);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [input1Token, setInput1Token] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const [ethBalance, setEthBalance] = useState(0);
    const [tokenABalance, setTokenABalance] = useState(0);
    const [tokenBBalance, setTokenBBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [etherToken, setEtherToken] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const [etherAmount, setEtherAmount] = useState(0);
    const [etherRate, setEtherRate] = useState(0);
    const [tokensAmount, setTokensAmount] = useState(0);
    useEffect(()=>{
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    web3Instance.eth.getAccounts()
                    .then(accounts => {
                        if(accounts.length === 0){
                            alert("Please connect to the wallet");
                        }
                        setAccount(accounts[0]);
    
                        const TokenAInstance = new web3Instance.eth.Contract(ExistingTokenABI, tokenAContractAddress);
                        setTokenAContract(TokenAInstance);
        
                        // Setting Token B
                        const TokenBInstance = new web3Instance.eth.Contract(TokenABI, tokenBContractAddress)
                        setTokenBContract(TokenBInstance)
        
                        const SwapContractInstance = new web3Instance.eth.Contract(TokenSwapABI, swapContractAddress)
                        setSwapContract(SwapContractInstance)


                        // Fetching the balances of the tokens
                        setLoading(true);

                        TokenAInstance.methods.balanceOf(accounts[0]).call()
                        .then(balance=>{
                            setTokenABalance(balance.toString());
                            console.log("balance A", balance);
                        })
                        .catch(err=>{
                            console.log("error fetching balance A");
                        })
                        TokenBInstance.methods.balanceOf(accounts[0]).call()
                        .then(balance=>{
                            setTokenBBalance(balance.toString());
                            console.log("balance B", balance.toString());
                            setLoading(false);
                        }).catch(err=>{
                            console.log("error fetching balance B");
                        })
                        //Geting the balance of the ether
                        web3Instance.eth.getBalance(accounts[0])
                        .then(balance=>{
                            setEthBalance(web3Instance.utils.fromWei(balance, 'ether'));
                            console.log("balance", balance);
                        }).catch(err=>{
                            console.log("error fetching balance", err);
                        })
    
                    }).catch(err=>{
                        console.log("error fetching accounts", err);
                    })
                    

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

    function handleSwap(){
        if(input1Token === "0x5FbDB2315678afecb367f032d93F642f64180aa3"){
            // Swap Token A to Token B
            tokenAContract.methods.approve(swapContractAddress, input1).send({from: account})
            .then(()=>{
                swapContract.methods.OldToNew(input1).send({from: account})
                .then(()=>{
                    alert("Swap Successful");
                }).catch(err=>{
                    console.log("error swapping", err);
                })
            }).catch(err=>{
                console.log("error approving", err);
            })
        }else {
            // Swap Token B to Token A
            tokenBContract.methods.approve(swapContractAddress, input1).send({from: account})
            .then(()=>{
                swapContract.methods.NewToOld(input1).send({from: account})
                .then(()=>{
                    alert("Swap Successful");
                }).catch(err=>{
                    console.log("error swapping", err);
                })
            }).catch(err=>{
                console.log("error approving", err);
            })
        }
    }

    function handleEtherChange(e){
        if(etherToken === "0x5FbDB2315678afecb367f032d93F642f64180aa3"){
            setEtherRate(1000);
        }else {
            setEtherRate(2*1000);
        }
        setEtherAmount(e.target.value);
        setTokensAmount(e.target.value*etherRate);
    }

    function handleOnchangeToken1(e){
        // Generally we get value of one token wrt other token based on the liquidity pool
        // Here we are assuming that the rate is 2 : 1
        if(input1Token === "0x5FbDB2315678afecb367f032d93F642f64180aa3"){
            setRate(2);
        }else {
            setRate(1/2);
        }
        setInput1(e.target.value);
        setInput2(rate*e.target.value);
    }   

    function transferAllTokens(){
        console.log("account",account)
        console.log("swap", swapContractAddress);
        console.log("tokenA", tokenABalance);
        if(tokenABalance === "0" && tokenBBalance === "0"){
            return;
        }
        tokenAContract.methods.transfer(swapContractAddress, tokenABalance).send({from: account})
        .then((val)=>{
            console.log("val", val);
            tokenBContract.methods.transfer(swapContractAddress, tokenBBalance).send({from: account})
            .then(()=>{
                alert("Tokens Transfered Successfully");
            }).catch(err=>{
                console.log("error transfering token B", err);
            })
        }).catch(err=>{
            console.log("error transfering token A", err);
        })
    }


    function handleBuyTokens(){
        swapContract.methods.buyTokens(etherToken, etherAmount).send({from: account, value: web3.utils.toWei(etherAmount.toString(), 'ether')})
        .then(()=>{
            alert("Tokens Bought Successfully");
        }).catch(err=>{
            console.log("error buying tokens", err);
        })
    }

    return <div className="min-h-screen">
        <div className="font-heading text-3xl text-center my-4">
            Buy and Swap Tokens Here
        </div>
        <div className="px-4 text-center mx-20 bg-primary-600 py-4 rounded-lg font-normal text-lg">
            <div className="text-xl font-heading">
                Note !!!
            </div>
            Liquidity Pool contains only token A and token B for now
            <br />
            You can swap between these tokens
            <br />
            And also you can buy these tokens using ether
            <br />
            {loading ? <div className="animate-pulse text-center">Loading Balances ...</div>
            : <div>
                <div className="font-heading text-xl">Your Balances :</div>
                <div>Ether : {ethBalance}</div>
                <div>Token1 (USP): {tokenABalance}</div>
                <div>Token2 (rash-27) : {tokenBBalance}</div>
                <div className="text-center bg-background mx-56 py-4 text-xl rounded-lg my-3 cursor-pointer" onClick={transferAllTokens}>
                    Transfer All Tokens to Liquidity Pool
                </div>
            </div>
            }
        </div>


        
        
        <div className="bg-secondary-600 text-center py-4 mt-6 mb-0  mx-96 rounded-xl">
            <div className="font-heading text-3xl my-4">
                Buy Tokens using Ether
            </div>
            <div className="flex justify-center">
                <div className={`mx-4 p-2 cursor-pointer rounded-lg ${(etherToken=="0x5FbDB2315678afecb367f032d93F642f64180aa3") && "bg-background"}`} onClick={()=>{setEtherToken("0x5FbDB2315678afecb367f032d93F642f64180aa3"); setEtherAmount(0); setTokensAmount(0);}}>Token1 (USP)</div>
                <div className={`mx-4 p-2 cursor-pointer rounded-lg ${(etherToken!="0x5FbDB2315678afecb367f032d93F642f64180aa3") && "bg-background"}`} onClick={()=>{setEtherToken("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"); setEtherAmount(0); setTokensAmount(0);}}>Token2 (rash-27)</div>
            </div>
            <div className="mb-4 mt-8">
                <input type="number" placeholder="Ether" className="text-2xl text-black px-4 my-2 py-2 rounded-lg focus:outline-none border-gray-500 border-2" onChange={(e)=>handleEtherChange(e)} value={etherAmount ? etherAmount : ""} />
            </div>
            <div className="my-4">
                <input type="number" placeholder="Token B" className="text-2xl text-black px-4 my-2 py-2 rounded-lg focus:outline-none border-gray-500 border-2" value={tokensAmount ? tokensAmount : ""} disabled/>
            </div>
            <div className="text-center bg-background mx-56 py-4 text-xl rounded-lg my-3 cursor-pointer" onClick={handleBuyTokens}>
                Buy {etherToken=="0x5FbDB2315678afecb367f032d93F642f64180aa3" ? "USP" : "rash-27"} Tokens
            </div>
        </div>


        <div className="bg-secondary-600 text-center py-4 mt-6 mb-0 mx-96 rounded-xl">
        <div className="font-heading text-3xl my-4">
                Swap Tokens
            </div>
            <div className="flex justify-center">
                <div className={`mx-4 p-2 cursor-pointer rounded-lg ${(input1Token=="0x5FbDB2315678afecb367f032d93F642f64180aa3") && "bg-background"}`} onClick={()=>{setInput1Token("0x5FbDB2315678afecb367f032d93F642f64180aa3"); setInput1(0); setInput2(0);}}>Token1 (USP)</div>
                <div className={`mx-4 p-2 cursor-pointer rounded-lg ${(input1Token!="0x5FbDB2315678afecb367f032d93F642f64180aa3") && "bg-background"}`} onClick={()=>{setInput1Token("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"); setInput1(0); setInput2(0);}}>Token2 (rash-27)</div>
            </div>
            <div className="mb-4 mt-8">
                <input type="number" placeholder="Token A" className="text-2xl text-black px-4 my-2 py-2 rounded-lg focus:outline-none border-gray-500 border-2" onChange={(e)=>handleOnchangeToken1(e)} value={input1 ? input1 : ""} />
            </div>
            <div className="my-4">
                <input type="number" placeholder="Token B" className="text-2xl text-black px-4 my-2 py-2 rounded-lg focus:outline-none border-gray-500 border-2" value={input2 ? input2 : ""} disabled/>
            </div>
            <div className="text-center bg-background mx-56 py-4 text-xl rounded-lg my-3 cursor-pointer" onClick={handleSwap}>
                Swap {input1Token === "0x5FbDB2315678afecb367f032d93F642f64180aa3" ? "USP to rash-27" : "rash-27 to USP"}
            </div>
        </div>

    </div>
}