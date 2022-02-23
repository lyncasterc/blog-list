import axios from 'axios';

let token = null;
const config = {
  headers: { Authorization: '' },
};

const setToken = (tokenInfo) => {
  token = `bearer ${tokenInfo}`;
  config.headers.Authorization = token;
};

const createUrl = (blogId) => `/api/blogs/${blogId}/comments`;

const create = async (blogId, comment) => {
  const url = createUrl(blogId);

  try {
    const response = await axios.post(url, comment, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

const exports = {
  create,
  setToken,
};

export default exports;
