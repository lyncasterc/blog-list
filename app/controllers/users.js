const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, likes: 1 });
  response.json(users);
});

usersRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params;

  try {
    const user = await User.findById(id);
    if (!user) return response.status(404).end();

    await user.populate('blogs', { title: 1, author: 1, likes: 1 });
    response.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  const { body } = request;
  const user = await User.findOne({ username: body.username });

  if (user) return response.status(400).send({ error: 'That username is already taken!' });
  if (body.password.length < 3) return response.status(400).send({ error: 'Password is too short!' });

  const passwordHash = await bcrypt.hash(body.password, 10);

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
