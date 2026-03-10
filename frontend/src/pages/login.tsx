import { useState } from "react";
import { loginUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const res = await loginUser(email, password);

      dispatch(setUser(res.user));

      console.log("Login success");

    } catch (error) {

      console.log("Login failed");

    }

  };

  return (

    <form onSubmit={handleLogin}>

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Login</button>

    </form>

  );
};

export default Login;