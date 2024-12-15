import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.tsx';

const Login: React.FC = () => {
  const { fetchUserData } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/login/google';
  };

  const handleFetchUserData = async () => {
    await fetchUserData();
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login with Google</h1>
      <button onClick={handleLogin} style={{ marginRight: '10px', padding: '10px 20px' }}>
        Login
      </button>
      <button onClick={handleFetchUserData} style={{ padding: '10px 20px' }}>
        Fetch User Data
      </button>
    </div>
  );
};

export default Login;
