import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        const data = await res.json();
        const { token, userName } = data;
        if (token && userName) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userName));
          alert("Login successful");
          navigate("/");
        } else {
          setError("Invalid response from server");
          alert("Login failed");
        }
      } else {
        const data = await res.json();
        setError(data.message || "Failed to login user");
        alert('Login failed');
      }
    } catch (err) {
      console.log(err);
      setError("Failed to login user");
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="left-container">
        <form onSubmit={handleSubmit}>
          <h1>Already have an account?</h1>
          <h2>Your personal job finder is here</h2>
          <input type="text" name="email" id="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button type="submit">Login</button>
          <p>Don&apos;t have an account?  <a href="/register">Sign Up</a></p>
          {loading && <p style= {{ color: 'blue'}}>Loading...</p> }
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        
      </div> 
      <div className="right-container">
        <h2>Your Personal Job Finder</h2>
      </div>
    </div>
  );
}