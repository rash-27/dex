import { Link } from "react-router-dom"

export default function AppBar() {
    return (
        <div className="text-white p-2 border-b-white flex justify-between">
            <Link to={"/"} className="text-2xl font-heading">DEX</Link>
        <div className="flex flex-col justify-center">
            <div className="flex justify-center">
                <Link to={"/"} className="px-2">Swap Tokens</Link>
                <Link to={"/transactions"} className="px-2">Transactions</Link>
            </div>
        </div>
        </div>
    )
}