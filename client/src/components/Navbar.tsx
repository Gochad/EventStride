import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutButton from "./LogoutButton.tsx";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            MainPage
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/runners">
            Runners
          </Button>
          <Button color="inherit" component={Link} to="/race_events">
            Events
          </Button>
          <LogoutButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
