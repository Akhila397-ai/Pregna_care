import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import OtpPage from "./pages/otpPage";
import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/admin/admin.login";
import AdminDashboard from "./pages/admin/AdminDashbord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route  path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/admin/login" element={<AdminLogin />}/>
        <Route path="/admin/users" element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;