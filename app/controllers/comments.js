const commentsRouter = require('express').Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

commentsRouter.post('/', async (request, response, next) => {
  const { content } = request.body;
  const { blogId } = request.params;
  const decodedToken = !request.token ? false : jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken || !decodedToken.id) {
    return response.status(401).send({
      error: 'token missing or invalid',
    });
  }

  try {
    const blog = await Blog.findById(blogId);
    const comment = new Comment({ content });

    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment);
    await blog.save();
    response.status(201).send(savedComment);
  } catch (error) {
    next(error);
  }
});

module.exports = commentsRouter;
