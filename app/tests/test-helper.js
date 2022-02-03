const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

// creating test user for the required userID fields in the test blogs
const createTestUser = async (username) => {
  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ name: 'Superuser', username, passwordHash });
  const savedUser = (await user.save()).toJSON();
  return savedUser;
};

const nonExistingID = async () => {
  const blog = {
    title: 'title3',
    author: 'uncle billy',
    url: 'whatintarnation2.com',
    likes: 10,
  };
  const blogObject = new Blog(blog);
  await blogObject.save();
  await blogObject.remove();

  return blogObject.id;
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  blogsInDB,
  nonExistingID,
  usersInDB,
  createTestUser,
};
