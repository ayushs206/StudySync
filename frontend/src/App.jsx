import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import Classes from "./pages/Classes";

import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/settings" element={<Settings />} />
      
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  )
}

export default App
