import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send login request to the backend
    axios.post('http://127.0.0.1:5000/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        // Store the JWT token in localStorage
        localStorage.setItem("jwtToken", response.data.access_token);
        alert('Logged in successfully!');
        onLogin(); // Call the onLogin function to update the parent component's state
      })
      .catch(error => {
        alert('Error logging in!');
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
