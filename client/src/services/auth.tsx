import axios from "axios";
import CONFIG from "../config.tsx";

const API_URL = `${CONFIG.API_URL}/auth`;

const api = axios.create({
    baseURL: API_URL,
});

const AuthService = {
  checkAuth: async () => {
    try {
      const response = await api.get('/user', {
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
      await api.get('/logout', { withCredentials: true });
      window.location.reload(); 
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
};

export default AuthService;
