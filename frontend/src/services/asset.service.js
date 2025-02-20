import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const getAllAssets = async () => {
  const response = await axios.get(`${API_URL}/assets`);
  return response.data;
};

const getAssetById = async (id) => {
  const response = await axios.get(`${API_URL}/assets/${id}`);
  return response.data;
};

const createAsset = async (assetData) => {
  const response = await axios.post(`${API_URL}/assets`, assetData);
  return response.data;
};

const updateAsset = async (id, assetData) => {
  const response = await axios.put(`${API_URL}/assets/${id}`, assetData);
  return response.data;
};

const deleteAsset = async (id) => {
  const response = await axios.delete(`${API_URL}/assets/${id}`);
  return response.data;
};

const assetService = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
};

export default assetService;
    