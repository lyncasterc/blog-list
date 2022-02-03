const supertest = require('supertest');
const app = require('../app');
const testDB = require('./test-db');
const Blog = require('../models/blog');
const testHelper = require('./test-helper');

const api = supertest(app);

beforeAll(() => testDB.connect());
beforeEach(async () => {
  await testDB.clear();

  const savedUser = await testHelper.createTestUser('admin');
  const initialBlogs = [
    {
      title: 'title1',
      author: 'bob dob',
      url: 'reallycoolurl.com',
      likes: 2,
      creator: savedUser.id,
    },
    {
      title: 'title2',
      author: 'uncle bo',
      url: 'whatintarnation.com',
      likes: 10,
      creator: savedUser.id,
    },
  ];

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
afterAll(() => testDB.close());

describe('when there are blogs initially in database', () => {
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

  test('identifier for blog creator is named creator', async () => {
    const currentBlogs = await testHelper.blogsInDB();
    currentBlogs.forEach((blog) => expect(blog.creator).toBeDefined());
  });

  test('all blogs are returned', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const response = await api
      .get('/api/blogs');

    expect(response.body).toHaveLength(startBlogs.length);
  });
});

describe('posting blogs', () => {
  test('can post a valid blog', async () => {
    const testUser = await testHelper.createTestUser('admin2');
    const startBlogs = await testHelper.blogsInDB();

    const validNote = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
      userID: testUser.id,
    };

    await api
      .post('/api/blogs')
      .send(validNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allCurrentBlogs = await testHelper.blogsInDB();
    const titles = allCurrentBlogs.map((blog) => blog.title);

    expect(titles).toContainEqual(validNote.title);
    expect(titles).toHaveLength(startBlogs.length + 1);
  });

  test('cannot post blog with missing url', async () => {
    const testUser = await testHelper.createTestUser('admin2');
    const startBlogs = await testHelper.blogsInDB();
    const invalidNote = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      likes: 10,
      userID: testUser.id,
    };

    await api
      .post('/api/blogs')
      .send(invalidNote)
      .expect(400);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
  });

  test('cannot post blog with missing title', async () => {
    const testUser = await testHelper.createTestUser('admin2');
    const startBlogs = await testHelper.blogsInDB();
    const invalidNote = {
      author: 'supervalidauthor',
      likes: 10,
      userID: testUser.id,
    };

    await api
      .post('/api/blogs')
      .send(invalidNote)
      .expect(400);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
  });

  test('blog posted with no like property is set to 0 likes', async () => {
    const testUser = await testHelper.createTestUser('admin2');
    const validNote = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      userID: testUser.id,
    };
    const response = await api
      .post('/api/blogs')
      .send(validNote);

    const savedNote = response.body;
    expect(savedNote.likes).toBe(0);
  });
});

describe('deleting blogs', () => {
  test('can delete existing blog', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const targetBlogID = startBlogs[0].id;

    await api
      .delete(`/api/blogs/${targetBlogID}`)
      .expect(204);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length - 1);
  });
});

describe('updating blogs', () => {
  test.only('can update existing blog', async () => {
    const targetBlog = (await testHelper.blogsInDB())[0];
    const updatedBlog = {
      title: targetBlog.title,
      author: targetBlog.author,
      url: targetBlog.url,
      likes: targetBlog.likes += 3,
      id: targetBlog.id,
      creator: targetBlog.creator,
    };

    await api
      .put(`/api/blogs/${targetBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const retrievedBlog = (await Blog.findById(targetBlog.id)).toJSON();
    expect(updatedBlog).toEqual(retrievedBlog);
  });
});
