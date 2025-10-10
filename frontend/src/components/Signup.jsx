// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const initialState = { name: "", email: "", password: "", confirmPassword: "" };

export default function Signup() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = form;
    if (!name.trim() || !email.trim() || !password) {
      return "All fields are required.";
    }
    // simple email regex (not exhaustive)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Example POST - change URL to your backend endpoint
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // data.message expected from backend
        setError(data.message || "Signup failed. Try again.");
        setLoading(false);
        return;
      }

      // success — optionally show message then redirect to login
      alert("Signup successful. Please login.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create account</h2>

        {error && <div className="form-error">{error}</div>}

        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="name@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 6 characters"
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Re-enter password"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <p className="small">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
