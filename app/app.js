const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const testDB = require('./tests/test-db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const app = express();
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

if (process.env.NODE_ENV === 'production') {
  logger.info('Connecting to: ', config.MONGODB_URI);

  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB: ', error.message);
    });
} else if (process.env.NODE_ENV === 'development') {
  testDB.connect();
}

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use(middleware.errorHandler);
module.exports = app;
