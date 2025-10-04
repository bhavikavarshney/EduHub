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
    return noCacheHeaders; // fallback
  }
};

export const addCourse = async (formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/courses/addCourse`,
    formData,
    getAuthHeaders()
  );
  return response.data;
};

export const getAllCourses = async (params) => {
  const response = await axios.get(
    `${BASE_URL}/api/courses/getAllCourses`,
    {
      ...getAuthHeaders(),
      params,
    }
  );
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axios.get(
    `${BASE_URL}/api/courses/getCourseById/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.put(
    `${BASE_URL}/api/courses/softDeleteCourse/${id}`,
    null,
    getAuthHeaders()
  );
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await axios.put(
    `${BASE_URL}/api/courses/updateCourse/${id}`,
    data,
    getAuthHeaders()
  );
  return response.data;
};