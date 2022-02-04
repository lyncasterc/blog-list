const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findOne({ username: body.username });

  const userValidated = !user ? false : await bcrypt.compare(body.password, user.passwordHash);

  if (!userValidated) {
    return response.status(401).send({
      error: 'invalid username or password',
    });
  }

  const tokenUserInfo = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(
    tokenUserInfo,
    process.env.SECRET = 'scrt',
    { expiresIn: 60 * 60 },
  );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
