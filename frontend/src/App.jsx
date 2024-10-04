import AppBar  from "./components/AppBar"
import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Transaction from "./components/Transaction"
import Swap from "./components/Swap"
import { useState } from "react"
function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenAContract, setTokenAContract] = useState(null);
  const [tokenBContract, setTokenBContract] = useState(null);
  const [swapContract, setSwapContract] = useState(null);
  const tokenAContractAddress = "";
  const tokenBContractAddress = "";
  const swapContractAddress = "";
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
        <Route path="/" element={<Swap />} />
        <Route path="/transactions" element={<Transaction />} />
    </Routes>
    </div>
  </BrowserRouter>
  )
}

export default App
