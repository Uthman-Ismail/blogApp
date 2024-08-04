import api from './api';

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    if(!response.data){
      return;
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if(!response.data){
      return;
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
