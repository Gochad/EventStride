import React from "react";
import { Button } from "@mui/material";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("runner_token");

      window.location.href = "/runners/login";
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
