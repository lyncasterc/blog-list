/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-unused-vars
  const { MongoMemoryServer } = require('mongodb-memory-server');
}

let mongodbServer;

const connect = async () => {
  // eslint-disable-next-line no-undef
  mongodbServer = await MongoMemoryServer.create();
  const testMongoDBURI = mongodbServer.getUri();

  try {
    await mongoose.connect(testMongoDBURI);
    logger.info('Connected to TEST MongoDB');
  } catch (error) {
    logger.error('Error connecting to TEST MongoDB: ', error);
  }
};

const close = async () => {
  await mongoose.disconnect();
  await mongodbServer.stop();
};

const clear = async () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach((key) => collections[key].deleteMany());
};

module.exports = {
  connect,
  close,
  clear,
};
