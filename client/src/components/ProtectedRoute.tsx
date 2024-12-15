import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.tsx";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AuthService.checkAuth();
        if (userData && userData.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    AuthService.redirectToLogin();
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
