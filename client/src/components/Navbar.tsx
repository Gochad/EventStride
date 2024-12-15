import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5001/logout', { withCredentials: true });

      localStorage.removeItem('authToken');

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            MainPage
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button> 
          <Button color="inherit" component={Link} to="/runners">
            Runners
          </Button>
          <Button color="inherit" component={Link} to="/race_events">
            Events
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
