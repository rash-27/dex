import AppBar  from "./components/AppBar"
import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
function App() {

  return (
    <BrowserRouter>
    <div className="bg-background text-white">
    <AppBar />
      <Routes>

    </Routes>
    </div>
  </BrowserRouter>
  )
}

export default App
