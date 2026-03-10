import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import OtpPage from "./pages/otpPage";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route  path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;