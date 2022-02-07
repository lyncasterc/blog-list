import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;

const setToken = (tokenInfo) => {
  token = `bearer ${tokenInfo}`;
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
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

const exports = {
  getAll,
  create,
  setToken,
};

export default exports;
