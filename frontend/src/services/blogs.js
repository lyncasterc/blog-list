import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;
const config = {
  headers: { Authorization: '' },
};

const setToken = (tokenInfo) => {
  token = `bearer ${tokenInfo}`;
  config.headers.Authorization = token;
};

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const create = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

const update = async (updatedObject) => {
  try {
    const { id } = updatedObject;
    const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const exports = {
  getAll,
  create,
  setToken,
  update,
};

export default exports;
