import axios from "axios";
import CONFIG from "../config.tsx";

const API_URL = `${CONFIG.API_URL}/auth`;

const AuthService = {
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error checking authentication:", error);
      throw error;
    }
  },

  redirectToLogin: () => {
    window.location.href = `${API_URL}/google`;
  },

  logout: async () => {
    try {
      await axios.get(`${API_URL}/logout`, { withCredentials: true });
      window.location.reload(); 
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
};

export default AuthService;
