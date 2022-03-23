const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const testDB = require('./tests/test-db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const commentRouter = require('./controllers/comments');
const testingRouter = require('./controllers/testing');

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
} // else {
//  testDB.connect();
// }

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

// healthcheck endpoint for Github Actions worflow
app.get('/health', (request, response) => {
  response.send('ok');
});

app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
blogsRouter.use('/:blogId/comments', commentRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use(middleware.errorHandler);
module.exports = app;
