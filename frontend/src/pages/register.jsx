import React from "react";
import { useState } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
        email: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("http://localhost:3000/api/user/register", {

            method: "POST",
            headers: {
             "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
          res.status === 200 ? alert("User registered successfully") : alert("Failed to register user")
        }
        catch (err) {
          console.log(err);
          alert("Failed to register user");
        }
    }
    return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
        <input type="text" name="name" id="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="text" name="phone" id="phone" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
        <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}