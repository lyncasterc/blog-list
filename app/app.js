const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');

const app = express();
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('Connecting to: ', config.MONGODB_URI);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB: ', error.message);
    });
}

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

module.exports = app;
