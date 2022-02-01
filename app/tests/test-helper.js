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

module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingID,
};
