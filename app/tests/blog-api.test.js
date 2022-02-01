const supertest = require('supertest');
const app = require('../app');
const testDB = require('./test-db');
const Blog = require('../models/blog');
const testHelper = require('./test-helper');

const api = supertest(app);

beforeAll(() => testDB.connect());
beforeEach(async () => {
  await testDB.clear();

  const blogObjects = testHelper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
afterAll(() => testDB.close());

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier of blog is named id', async () => {
  const currentBlogs = await testHelper.blogsInDB();
  currentBlogs.forEach((blog) => expect(blog.id).toBeDefined());
});

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs');

  expect(response.body).toHaveLength(testHelper.initialBlogs.length);
});

test('can post a valid blog', async () => {
  const validNote = {
    title: 'supervalidnote',
    author: 'supervalidauthor',
    url: 'supervalidurl.com',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(validNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const allCurrentBlogs = await testHelper.blogsInDB();
  const titles = allCurrentBlogs.map((blog) => blog.title);

  expect(titles).toContainEqual(validNote.title);
  expect(titles).toHaveLength(testHelper.initialBlogs.length + 1);
});

test('cannot post blog with missing url', async () => {
  const invalidNote = {
    title: 'supervalidnote',
    author: 'supervalidauthor',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(invalidNote)
    .expect(400);

  const currentBlogs = await testHelper.blogsInDB();

  expect(currentBlogs).toHaveLength(testHelper.initialBlogs.length);
});

test('cannot post blog with missing title', async () => {
  const invalidNote = {
    author: 'supervalidauthor',
    url: 'supervalidurl.com',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(invalidNote)
    .expect(400);

  const currentBlogs = await testHelper.blogsInDB();

  expect(currentBlogs).toHaveLength(testHelper.initialBlogs.length);
});

test('blog posted with no like property is set to 0 likes', async () => {
  const validNote = {
    title: 'supervalidnote',
    author: 'supervalidauthor',
    url: 'supervalidurl.com',
  };
  const response = await api
    .post('/api/blogs')
    .send(validNote);

  const savedNote = response.body;
  expect(savedNote.likes).toBe(0);
});
