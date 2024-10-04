import AppBar  from "./components/AppBar"
import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Transaction from "./components/Transaction"
import Swap from "./components/Swap"
import { useState, useEffect } from "react"

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenAContract, setTokenAContract] = useState(null);
  const [tokenBContract, setTokenBContract] = useState(null);
  const [swapContract, setSwapContract] = useState(null);
  const tokenAContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tokenBContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const swapContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  return (
    <BrowserRouter>
    <div className="bg-background text-white">
    <AppBar web3={web3} setWeb3={setWeb3} account={account} setAccount={setAccount} 
    tokenAContract={tokenAContract} setTokenAContract={setTokenAContract}
    tokenBContract={tokenBContract} setTokenBContract={setTokenBContract}
    swapContract={swapContract} setSwapContract={setSwapContract}
    tokenAContractAddress={tokenAContractAddress}
    tokenBContractAddress={tokenBContractAddress}
    swapContractAddress={swapContractAddress}
    />
      <Routes>
        <Route path="/" element={<Swap
        web3={web3} setWeb3={setWeb3} account={account} setAccount={setAccount} 
        tokenAContract={tokenAContract} setTokenAContract={setTokenAContract}
        tokenBContract={tokenBContract} setTokenBContract={setTokenBContract}
        swapContract={swapContract} setSwapContract={setSwapContract}
        tokenAContractAddress={tokenAContractAddress}
        tokenBContractAddress={tokenBContractAddress}
        swapContractAddress={swapContractAddress}
        />} />
        <Route path="/transactions" element={<Transaction
        account={account} swapContract={swapContract} 
        />} />
    </Routes>
    </div>
  </BrowserRouter>
  )
}

export default App
