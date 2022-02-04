const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const testHelper = require('./test-helper');
const testDB = require('./test-db');
const app = require('../app');

const api = supertest(app);

beforeAll(async () => { await testDB.connect(); });
beforeEach(async () => { await testDB.clear(); });
afterAll(async () => { await testDB.close(); });

describe('successful login', () => {
  test('responds with 200 and returns JSON', async () => {
    const user = await testHelper.createTestUser('admin');

    await api
      .post('/api/login')
      .send({ username: user.username, password: 'secret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('responds with the token', async () => {
    const user = await testHelper.createTestUser('admin');

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'secret' });

    expect(response.body.token).toBeDefined();
  });

  test('decoded token contains username and id', async () => {
    const user = await testHelper.createTestUser('admin');

    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'secret' });

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);

    expect(decodedToken.id).toBe(user.id);
    expect(decodedToken.username).toBe(user.username);
  });
});

describe('unsuccessful login', () => {
  test('login with non-existing username responds with 401', async () => {
    const nonExistingUser = {
      username: 'i dont exist',
      password: 'i also dont exist',
    };

    const response = await api
      .post('/api/login')
      .send(nonExistingUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);
    expect(response.body.error).toContain('invalid username or password');
  });

  test('login with wrong password responds with 401', async () => {
    const user = await testHelper.createTestUser('admin');

    const invalidLoginInfo = {
      username: user.username,
      password: 'wrong password',
    };

    const response = await api
      .post('/api/login')
      .send(invalidLoginInfo)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('invalid username or password');
  });
});
