import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3002/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      window.location.href = `http://localhost:3001?token=${encodeURIComponent(
        res.data.token,
      )}`;
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="row ">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="row">
        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/register" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
