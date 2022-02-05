const logger = require('./logger');

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info('Method: ', request.method);
    logger.info('Path: ', request.path);
    logger.info('Body: ', request.body);
    logger.info('---');
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(error.message);
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: 'invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).send({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
};
