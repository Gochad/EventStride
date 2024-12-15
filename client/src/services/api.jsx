import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
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

export default api;