import { useState } from "react"

export default function Transaction({ account,swapContract}) {
    const [swapTransactions, setSwapTransactions] = useState(null);
    const [loadingSwap, setLoadingSwap] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [buyTransactions, setBuyTransactions] = useState(null)

    async function handleFetchSwapTrxns(){
        setLoadingSwap(true);
        try {
          const transactions = await swapContract.methods.getSwapTransferDetails(account).call();
          setSwapTransactions(transactions);
        } catch (err) {
          console.error('Error fetching swap transactions:', err);
        }
        setLoadingSwap(false);
    }
    async function handleFetchBuyTrxns(){
        setLoadingBuy(true);
        try {
          const transactions = await swapContract.methods.getBuyTransferDetails(account).call();
          console.log("Buy transactions",transactions);
          setBuyTransactions(transactions);
        } catch (err) {
          console.error('Error fetching buy transactions:', err);
        }
        setLoadingBuy(false);
    }

    return <div className="min-h-screen flex flex-col">
        <div className="my-4 py-4 border-gray-500 border-b">
            {/* Swap Transactions */}
            {swapTransactions ? 
            <div className="font-normal text-lg px-4 mx-2 py-2 my-4 text-center">Swap Transactions</div> 
            :
            <span className="font-normal flex justify-center text-lg bg-secondary-300 px-4 mx-2 my-4 py-2 rounded-lg text-primary-700 cursor-pointer" onClick={handleFetchSwapTrxns}>Fetch Swap Transactions</span>}

            <div className="mt-8">
                <div className="grid grid-cols-4 gap-3 bg-foreground py-2 ">
                    <div className="flex justify-center">
                        SNO
                    </div >
                    <div  className="flex justify-center">
                        Token A
                    </div>
                    <div className="flex justify-center">
                        Token B
                    </div>
                    <div className="flex justify-center">
                        Amount
                    </div>
                </div>
               {loadingSwap ?
                <div className="animate-pulse text-center">Loading Swap Transactions ...</div>
                : 
                <div></div>
                } 
            <div>
                <div>
                    {
                      swapTransactions && swapTransactions.length == 0 &&  !loadingSwap && <div className="text-center text-lg my-2">No Swap Transactions Yet</div>
                    }
                    {
                        swapTransactions &&
                        swapTransactions.map((trxns, i)=>{
                            return (<div key={i} className="grid grid-cols-4 gap-2 bg-foreground py-2 mx-0">
                            <div className="flex justify-center border-gray-500 ">
                                {i+1}
                            </div >
                            <div  className="flex justify-start border-gray-500  ">
                                {trxns.tokenA}
                            </div>
                            <div className="flex justify-start border-gray-500  ">
                                {trxns.tokenB}
                            </div>
                            <div className="flex justify-center">
                                {trxns.amount.toString()}
                            </div>
                            </div>)
                        })
                    }
                </div>
            </div>
            </div>
        </div>
        <div className="my-4 py-4">
            {/* Buy Transactions */}
            {buyTransactions ? 
            <div className="font-normal text-lg px-4 mx-2 py-2 my-4 text-center">Buy Transactions</div> 
            :
            <span className="font-normal flex justify-center text-lg bg-secondary-300 px-4 mx-2 my-4 py-2 rounded-lg text-primary-700 cursor-pointer" onClick={handleFetchBuyTrxns}>Fetch Buy Transactions</span>}

            <div className="mt-8">
                <div className="grid grid-cols-3 gap-4 bg-foreground py-2 mx-4">
                    <div className="flex justify-center">
                        SNO
                    </div >
                    <div className="flex justify-center">
                        Token
                    </div>
                    <div className="flex justify-center">
                        Amount
                    </div>
                </div>
               {loadingBuy ?
                <div className="animate-pulse text-center">Loading Buy Transactions ...</div>
                : 
                <div></div>
                } 
            <div>
                <div>
                    {
                       buyTransactions && buyTransactions.length == 0 && !loadingBuy && <div className="text-center text-lg my-2">No Buy Transactions Yet</div>
                    }
                    {
                        buyTransactions &&
                        buyTransactions.map((trxns, i)=>{
                            return (<div key={i} className="grid grid-cols-3 gap-4 bg-foreground py-2 mx-4">
                            <div className="flex justify-center">
                                {i+1}
                            </div >
                            <div className="flex justify-center">
                                {trxns.token}
                            </div>
                            <div className="flex justify-center">
                                {trxns.amount.toString()}
                            </div>
                            </div>)
                        })
                    }
                </div>
            </div>
            </div>
        </div>
    </div>
}