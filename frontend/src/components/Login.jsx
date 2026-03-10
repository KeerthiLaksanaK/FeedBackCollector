import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const req = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { message, isLoggedIn, user } = req.data;

      if (isLoggedIn) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        alert(message);
        navigate("/");
      } else {
        alert(message);
      }
    } catch (e) {
      console.error("Login error:", e);
      if (e.response) {
        alert("Login Failed: " + (e.response.data?.message || "Server error"));
      } else {
        alert("Login Failed: Unable to connect to server");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Login
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Create an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;