import { useState } from "react";
import "./register.css"

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
            method: "POST",
            headers: {
             "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
          if (res.status === 200) {
            alert("User registered successfully");
          } else {
            const data = await res.json();
            setError(data?.message || "Failed to register user");
          }
        }
        catch (err) {
          console.log(err);
          setError("Failed to register user");
        } finally {
          setLoading(false);
        }
    }
    return (
    
    <div className="container">
      <div className="left-container">
        <form onSubmit={handleSubmit}>
          <h1>Create an account?</h1>
          <h2>Your personal job finder is here</h2>
          <input type="text" name="name" id="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="text" name="phone" id="phone" placeholder="Mobile" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <div className="terms">
            <input type="checkbox" name="terms" id="terms" required />
            <label htmlFor="terms">By creating an account, I agree to our terms of use and privacy policy</label>
          </div>
          <button type="submit">Create Account</button>
          <p style={{ paddingTop: "10px"}}>Already have an account?  <a href="/login">Sign In</a></p>
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