import React, { useState } from 'react';
import '../style/login.css';
import { login } from '../server/auth';
import { useNavigate } from 'react-router-dom'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    console.log('Logging in: ', user);
    if(user.token){
      localStorage.setItem('token', user.token);
      navigate('/');  // Navigate to home page after successful login
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
