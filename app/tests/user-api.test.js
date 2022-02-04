const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const testDB = require('./test-db');
const testHelper = require('./test-helper');
const User = require('../models/user');
// const Blog = require('../models/blog');

const api = supertest(app);

beforeAll(async () => { await testDB.connect(); });
beforeEach(async () => {
  await testDB.clear();

  const passwordHash = await bcrypt.hash('secret', 10);
  const initialUsers = [
    {
      name: 'Superuser',
      username: 'admin',
      passwordHash,
    },
    {
      name: 'Superuser2',
      username: 'admin2',
      passwordHash,
    },
  ];

  const userObjects = initialUsers.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});
afterAll(async () => { await testDB.close(); });

describe('when mutiple users are in database', () => {
  describe('when getting users', () => {
    test('all saved users are returned', async () => {
      const startUsers = await testHelper.usersInDB();
      const response = await api
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(startUsers.length);
    });

    test('users are returned as JSON', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('when creating users', () => {
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
      const { username } = startUsers[0];
      const invalidUser = {
        username,
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

  describe('when user posts a blog', () => {
    beforeEach(async () => {
      const { id } = await User.findOne({ username: 'admin' });
      const blog = {
        title: 'cool title ',
        author: 'cool author',
        url: 'cool.com',
        likes: 0,
        userID: id,
      };

      await api
        .post('/api/blogs')
        .send(blog);
    });

    test.only('blog is added to the user notes array', async () => {
      const user = await User.findOne({ username: 'admin' });
      expect(user.blogs).toBeDefined();
      expect(user.blogs).toHaveLength(1);
    });
  });
});
