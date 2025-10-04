import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const noCacheHeaders = {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
};

const getAuthHeaders = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser?.token;
    if (!token) throw new Error('No token found');
    return {
      headers: {
        ...noCacheHeaders.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (err) {
    console.error('Error retrieving token:', err.message);
    return noCacheHeaders;
  }
};

export const addMaterial = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/materials/addFile`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const editMaterial = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/api/materials/update/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteMaterial = async (id) => {
  const response = await axios.put(`${BASE_URL}/api/materials/softDeleteMaterial/${id}`, null, getAuthHeaders());
  return response.data;
};

export const getMaterialById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/materials/${id}`, getAuthHeaders());
  return response.data;
};

export const getMaterialsByCourseId = async (courseId, page = 1, limit = 1) => {
  const response = await axios.get(`${BASE_URL}/api/materials/course/${courseId}`, {
    ...getAuthHeaders(),
    params: { page, limit },
  });
  return response.data;
};

export const getAllMaterials = async (params) => {
  const response = await axios.get(`${BASE_URL}/api/materials/course`, {
    ...getAuthHeaders(),
    params,
  });
  return response.data;
};