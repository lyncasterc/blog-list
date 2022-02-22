import axios from 'axios';

const baseUrl = '/api/users';

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getOne = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const exports = {
  getAll,
  getOne,
};

export default exports;
