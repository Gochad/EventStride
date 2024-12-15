import axios from 'axios';
import CONFIG from '../config.tsx';

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

export default api;