const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'title1',
    author: 'bob dob',
    url: 'reallycoolurl.com',
    likes: 2,
  },
  {
    title: 'title2',
    author: 'uncle bo',
    url: 'whatintarnation.com',
    likes: 10,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDB,
};
