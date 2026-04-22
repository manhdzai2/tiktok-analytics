import axios from 'axios';

const API_BASE_URL = 'https://tiktok-analytics-production-3c5c.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getChannels = async (page = 1, perPage = 10) => {
  const response = await api.get(`/channels?page=${page}&perPage=${perPage}`);
  return response.data;
};

export const getChannelDetail = async (id: string) => {
  const response = await api.get(`/channels/${id}`);
  return response.data;
};

export const importTikTok = async (url: string) => {
  const response = await api.post('/import-tiktok', { url });
  return response.data;
};

export const bulkImportTikTok = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/bulk-action/import-channels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getImportStatus = async (id: string) => {
  const response = await api.get(`/imports/${id}`);
  return response.data;
};

export const deleteChannel = async (id: string) => {
  const response = await api.delete(`/channels/${id}`);
  return response.data;
};

export const bulkDeleteChannels = async (ids: string[]) => {
  const response = await api.post('/channels/bulk-delete', { ids });
  return response.data;
};

export default api;
