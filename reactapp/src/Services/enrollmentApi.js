import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/enrollment`;

const noCacheHeaders = {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
};

const getAuthHeaders = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser?.token;
    if (!token) throw new Error("No token found");
    return {
      headers: {
        ...noCacheHeaders.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (err) {
    console.error("Error retrieving token:", err.message);
    return noCacheHeaders;
  }
};

export const getEnrollmentsByUserId = async (
  userId,
  page = 1,
  limit = 10,
  searchTerm
) => {
  const response = await axios.get(
    `${BASE_URL}/getEnrollmentsByUserId/${userId}`,
    {
      ...getAuthHeaders(),
      params: { page, limit, search: searchTerm },
    }
  );
  return response.data;
};

export const addEnrollment = async (data) => {
  const response = await axios.post(
    `${BASE_URL}/addEnrollment`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteEnrollment = async (enrollmentId) => {
  const response = await axios.delete(
    `${BASE_URL}/deleteEnrollment/${enrollmentId}`,
    getAuthHeaders()
  );
  return response.data;
};

export const updateEnrollmentStatus = async (id, status) => {
  const response = await axios.patch(
    `${BASE_URL}/updateStatus/${id}`,
    { status },
    {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getAllEnrollments = async () => {
  const response = await axios.get(
    `${BASE_URL}/getAllEnrollments`,
    getAuthHeaders()
  );
  return response.data;
};
