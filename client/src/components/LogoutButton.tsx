import React from "react";
import { Button } from "@mui/material";
import AuthService from "../services/auth.tsx";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
