const supertest = require('supertest');
const app = require('../app');
const testDB = require('./test-db');
const Blog = require('../models/blog');
const testHelper = require('./test-helper');

const api = supertest(app);
let token;
let testUser;

beforeAll(() => testDB.connect());
beforeEach(async () => {
  await testDB.clear();

  testUser = await testHelper.createTestUser('admin1');

  const loginInfo = {
    username: testUser.username,
    password: 'secret',
  };

  const response = await api
    .post('/api/login')
    .send(loginInfo);

  token = response.body.token;

  const initialBlogs = [
    {
      title: 'title1',
      author: 'bob dob',
      url: 'reallycoolurl.com',
      likes: 2,
      creator: testUser.id,
    },
    {
      title: 'title2',
      author: 'uncle bo',
      url: 'whatintarnation.com',
      likes: 10,
      creator: testUser.id,
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
    const startBlogs = await testHelper.blogsInDB();

    const validNote = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allCurrentBlogs = await testHelper.blogsInDB();
    const titles = allCurrentBlogs.map((blog) => blog.title);

    expect(titles).toContainEqual(validNote.title);
    expect(titles).toHaveLength(startBlogs.length + 1);
  });

  test('posting blog without token fails with 401', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const note = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .send(note)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
    expect(response.body.error).toContain('token missing or invalid');
  });

  test('posting blog with missing url fails with 400', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const invalidBlog = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(400);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
  });

  test('cannot post blog with missing title', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const invalidBlog = {
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(400);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
  });

  test('blog posted with no like property is set to 0 likes', async () => {
    const validNote = {
      title: 'supervalidnote',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
    };
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validNote);

    const savedNote = response.body;
    expect(savedNote.likes).toBe(0);
  });
});

describe('deleting blogs', () => {
  test('authenticated user can delete existing a blog they created', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const targetBlogID = startBlogs[0].id;

    await api
      .delete(`/api/blogs/${targetBlogID}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length - 1);
  });

  test('delete request with no token fails with 401', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const targetBlogID = startBlogs[0].id;

    const response = await api
      .delete(`/api/blogs/${targetBlogID}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const endBlogs = await testHelper.blogsInDB();

    expect(response.body.error).toContain('token missing or invalid');
    expect(endBlogs).toHaveLength(startBlogs.length);
  });

  test('delete request with token but non-matching user id fails with 401', async () => {
    const user = await testHelper.createTestUser('admin3');
    const startBlogs = await testHelper.blogsInDB();
    const loginInfo = {
      username: user.username,
      password: 'secret',
    };

    const loginResponse = await api
      .post('/api/login')
      .send(loginInfo);

    const unauthorizedToken = loginResponse.body.token;
    const targetBlogID = startBlogs[0].id;

    const response = await api
      .delete(`/api/blogs/${targetBlogID}`)
      .set('Authorization', `bearer ${unauthorizedToken}`)
      .expect(401);

    const endBlogs = await testHelper.blogsInDB();

    expect(response.body.error).toContain('unauthorized token');
    expect(endBlogs).toHaveLength(startBlogs.length);
  });
});

describe('updating blogs', () => {
  test('can update existing blog', async () => {
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
