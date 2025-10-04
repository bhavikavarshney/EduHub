import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const addUser = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/users/addUser`, formData);
  return response.data;
};


export const loginUser=async (formData)=>{
    const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/getUserByEmailAndPassword`,formData)
    return response.data
}
