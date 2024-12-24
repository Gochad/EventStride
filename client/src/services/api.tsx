import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CONFIG from '../config.tsx';
import { RaceEvent } from "../types";

const api = axios.create({
    baseURL: `${CONFIG.API_URL}/api`,
});

export const fetchRunners = async () => {
    try {
      const response = await api.get('/runners');
      return response.data;
    } catch (error) {
      console.error('Error fetching runners:', error.response || error.message);
      throw error;
    }
  };

export const createRunner = async (runnerData) => {
    try {
        const response = await api.post('/runners', runnerData);
        return response.data;
    } catch (error) {
        console.error('Error creating runner:', error.response || error.message);
        throw error;
    }
};

export const loginRunner = async (data) => {
  try {
      const response = await api.post('/runners/login', data);
      const token = response.data.access_token;
      localStorage.setItem('runner_token', token);
      let decodedToken = jwtDecode(token);
      if (decodedToken.sub) {
        localStorage.setItem('user_role', decodedToken.sub["role"]);
        localStorage.setItem('user_id', decodedToken.sub["id"]);
        
        const event = new Event("localStorageUpdate");
        window.dispatchEvent(event);
      } else {
        console.error('Decoded token does not contain sub property');
      }
  } catch (error) {
      console.error('Error login runner:', error.response || error.message);
      throw error;
  }
};

export const makeAdmin = async (runnerId: number) => {
  try {
    const response = await api.post(`/runners/${runnerId}/make_admin`);
    if (response.status !== 200) {
      alert('Failed to make runner an admin.');
    }
  } catch (error) {
    console.error('Error making runner admin:', error);
    alert('An error occurred. Please try again.');
  }
};

export const fetchRunnerById = async (id) => {
  try {
    const response = await api.get(`/runners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching runner:', error.response || error.message);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const response = await api.get('/race_events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const assignRunnerToEvent = async (runnerId: number, eventId: number) => {
  try {
    const response = await api.post(`/race_events/${eventId}/register_runner`, {
      runner_id: runnerId,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning runner to event:', error);
    throw error;
  }
};

export const updateRunner = async (runnerId: number, runnerData: any) => {
  try {
    const response = await api.put(`/runners/${runnerId}`, runnerData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating runner:", error.response || error.message);
    throw error;
  }
};

export const deleteRunner = async (runnerId: number) => {
  try {
    const response = await api.delete(`/runners/${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting runner:", error.response || error.message);
    throw error;
  }
};

export const getEventById = async (eventId: number): Promise<RaceEvent> => {
  const response = await api.get(`/race_events/${eventId}`);
  return response.data;
};

export const updateRaceEvent = async (eventId: number, eventData: Partial<RaceEvent>) => {
  try {
    const response = await api.put(`/race_events/${eventId}`, eventData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating race event:", error.response || error.message);
    throw error;
  }
};

export const deleteRaceEvent = async (eventId: number) => {
  try {
    const response = await api.delete(`/race_events/${eventId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting race event:", error.response || error.message);
    throw error;
  }
};

export default api;