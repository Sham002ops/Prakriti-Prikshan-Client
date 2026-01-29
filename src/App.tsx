
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import PrakritiLanding from "./pages/LandingPage";


function App() {
  const isLoggedIn = localStorage.getItem("loggedIn");
     
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home/>: <PrakritiLanding/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/landing" element={<PrakritiLanding/>}/>
      </Routes>
  
  </BrowserRouter>
}

export default App