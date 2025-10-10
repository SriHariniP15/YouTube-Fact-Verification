import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // --- Replace with your backend API URL later ---
      // const response = await fetch("http://localhost:5000/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   alert("Login successful!");
      //   setIsAuthenticated(true);
      //   navigate("/");
      // } else {
      //   alert(data.message || "Invalid email or password");
      // }

      // --- Temporary static login for admin ---
      if (email === "admin@gmail.com" && password === "1234") {
        alert("Login successful!");
        setIsAuthenticated(true);
        navigate("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  const goToSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        

        <h2>Login</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-link">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            onClick={goToSignup}
            style={{ color: "#6f4eff", textDecoration: "none" }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
