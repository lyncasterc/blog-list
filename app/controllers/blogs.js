const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('creator', { username: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request;
  const decodedToken = !request.token ? false : jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken || !decodedToken.id) {
    return response.status(401).send({
      error: 'token missing or invalid',
    });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    creator: user.id,
  });

  try {
    const savedBlog = await blog.save();
    await savedBlog.populate('creator', { username: 1 });
    user.blogs = user.blogs.concat(savedBlog);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    await updatedBlog.populate('creator', { username: 1 });
    response.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = !request.token ? false : jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken || !decodedToken.id) {
    return response.status(401).send({
      error: 'token missing or invalid',
    });
  }

  try {
    const blog = await Blog.findById(request.params.id);
    if (decodedToken.id !== blog.creator.toString()) {
      return response.status(401).send({
        error: 'unauthorized token',
      });
    }

    await Blog.deleteOne({ id: blog.id });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
