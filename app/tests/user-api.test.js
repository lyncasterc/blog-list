const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const testDB = require('./test-db');
const testHelper = require('./test-helper');
const User = require('../models/user');

const api = supertest(app);

beforeAll(async () => { await testDB.connect(); });
beforeEach(async () => { await testDB.clear(); });
afterAll(async () => { await testDB.close(); });

describe('creating users', () => {
  describe('when one user is in database', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('secret', 10);
      const user = new User({ name: 'Superuser', username: 'admin', passwordHash });
      await user.save();
    });

    test('creating valid user with unique username succeeds', async () => {
      const startUsers = await testHelper.usersInDB();

      const validUser = {
        username: 'billybo',
        name: 'Billy Bobby',
        password: 'supersecretpassword',
      };

      await api
        .post('/api/users')
        .send(validUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const endUsers = await testHelper.usersInDB();
      expect(endUsers).toHaveLength(startUsers.length + 1);

      const usernames = endUsers.map((user) => user.username);
      expect(usernames).toContain(validUser.username);
    });

    test('creating user with existing username fails with 400', async () => {
      const startUsers = await testHelper.usersInDB();
      const invalidUser = {
        username: 'admin',
        name: 'Billy Bobby',
        password: 'supersecretpassword',
      };

      const response = await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const endUsers = await testHelper.usersInDB();
      expect(endUsers).toHaveLength(startUsers.length);

      expect(response.body.error).toContain('That username is already taken!');
    });
  });

  test('creating user password shorter than 3 chars fails with 400', async () => {
    const startUsers = await testHelper.usersInDB();
    const invalidUser = {
      username: 'billybo',
      name: 'Billy Bobby',
      password: 'su',
    };

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const endUsers = await testHelper.usersInDB();
    expect(endUsers).toHaveLength(startUsers.length);

    expect(response.body.error).toContain('Password is too short!');
  });
});
