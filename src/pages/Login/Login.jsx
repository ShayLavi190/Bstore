import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// Login component
function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function setCookie(val, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${val}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
// Function to get a cookie
  function getCookie(val) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === val) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
// Function to delete a cookie
  function deleteCookie(val) {
    document.cookie = `${val}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
// Function to handle the email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
// Function to handle the password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
// Function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') return alert('Please fill in all fields');
    try {

      const response = await axios.post('http://localhost:6500/login', { email, password });
      
      if (response.data.success) {
        if (!getCookie(email)) {
          setCookie('email', email, 30);
          navigate("/shop", { replace: true });
        }
      } else {
        deleteCookie('email');
        setMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again.');
    }
  };
  const handleForgotPass = () => {
    navigate("/forgotpassword", { replace: true });
  }
  const handelGuest = () => {
    navigate("/shop", { replace: true });
  }
  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1 className='titlee'>Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button>Sign In</button>
        <h1 style={{marginTop:'50px'}}> forgot your password ?</h1>
        <button onClick={handleForgotPass}>click here</button>
        <button style={{marginTop:'50px'}}onClick={handelGuest}>continue as guest</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
