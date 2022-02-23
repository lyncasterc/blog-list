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

  test('getting blogs that had comments have comment populated', async () => {
    const targetBlog = (await testHelper.blogsInDB())[0];
    await api
      .post(`/api/blogs/${targetBlog.id}/comments`)
      .set('Authorization', `bearer ${token}`)
      .send({ content: 'a comment' });

    const response = await api
      .get('/api/blogs')
      .expect(200);

    const retrievedBlogs = response.body;
    const retrievedBlog = retrievedBlogs.find((blog) => blog.id === targetBlog.id);

    const comment = retrievedBlog.comments[0];

    expect(comment.content).toBeDefined();
    expect(comment.content).toBe('a comment');
  });
});

describe('posting blogs', () => {
  test('can post a valid blog', async () => {
    const startBlogs = await testHelper.blogsInDB();

    const validBlog = {
      title: 'supervalidblog',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allCurrentBlogs = await testHelper.blogsInDB();
    const titles = allCurrentBlogs.map((blog) => blog.title);

    expect(titles).toContainEqual(validBlog.title);
    expect(titles).toHaveLength(startBlogs.length + 1);
  });

  test('posting blog returns a blog with creator field populated', async () => {
    const validBlog = {
      title: 'supervalidblog',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedBlog = response.body;
    expect(savedBlog.creator.username).toBeDefined();
    expect(savedBlog.creator.username).toBe(testUser.username);
  });

  test('posting blog without token fails with 401', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const blog = {
      title: 'supervalidblog',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const endBlogs = await testHelper.blogsInDB();

    expect(endBlogs).toHaveLength(startBlogs.length);
    expect(response.body.error).toContain('token missing or invalid');
  });

  test('posting blog with missing url fails with 400', async () => {
    const startBlogs = await testHelper.blogsInDB();
    const invalidBlog = {
      title: 'supervalidblog',
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
    const validBlog = {
      title: 'supervalidblog',
      author: 'supervalidauthor',
      url: 'supervalidurl.com',
    };
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog);

    const savedBlog = response.body;
    expect(savedBlog.likes).toBe(0);
  });
});

describe('posting a comment to a blog', () => {
  describe('valid comment post requests', () => {
    test('returns the comment', async () => {
      const targetBlog = (await testHelper.blogsInDB())[0];
      const comment = { content: 'hey, a comment!' };

      const response = await api
        .post(`/api/blogs/${targetBlog.id}/comments`)
        .set('Authorization', `bearer ${token}`)
        .send(comment)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const returnedComment = response.body;

      expect(returnedComment).toBeDefined();
      expect(returnedComment.content).toEqual(comment.content);
    });

    test('adds the comment to the blogs comments array', async () => {
      const targetBlog = (await testHelper.blogsInDB())[0];
      const comment = { content: 'hey, a comment!' };

      await api
        .post(`/api/blogs/${targetBlog.id}/comments`)
        .set('Authorization', `bearer ${token}`)
        .send(comment);

      const updatedBlog = await Blog.findById(targetBlog.id);

      expect(updatedBlog.comments.length).toBe(1);
    });
  });

  describe('invalid comment post requests', () => {
    test('fails with 401 if comment is posted without token', async () => {
      const startBlog = (await testHelper.blogsInDB())[0];
      const comment = { content: 'hey, a comment!' };

      const response = await api
        .post(`/api/blogs/${startBlog.id}/comments`)
        .send(comment)
        .expect(401);

      const endBlog = await Blog.findById(startBlog.id);

      expect(response.body.error).toBe('token missing or invalid');
      expect(endBlog.comments.length).toBe(0);
    });

    test('comment without content fails with 400', async () => {
      const startBlog = (await testHelper.blogsInDB())[0];

      const response = await api
        .post(`/api/blogs/${startBlog.id}/comments`)
        .set('Authorization', `bearer ${token}`)
        .send({})
        .expect(400);

      const endBlog = await Blog.findById(startBlog.id);

      expect(response.body.error).toMatch(/comment can't be empty!/);
      expect(endBlog.comments.length).toBe(0);
    });
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
      ...targetBlog,
      likes: targetBlog.likes + 3,
    };

    await api
      .put(`/api/blogs/${targetBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const retrievedBlog = (await Blog.findById(targetBlog.id)).toJSON();
    expect(updatedBlog).toEqual(retrievedBlog);
  });

  test('updated blog has populated creator field', async () => {
    const targetBlog = (await testHelper.blogsInDB())[0];

    const updatedBlog = {
      ...targetBlog,
      likes: targetBlog.likes + 3,
    };

    const response = await api
      .put(`/api/blogs/${targetBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const retrievedBlog = response.body;
    expect(retrievedBlog.creator).toBeDefined();
    expect(retrievedBlog.creator.username).toBe(testUser.username);
  });

  test('updated blog that had comment has populated comments field', async () => {
    const targetBlog = (await testHelper.blogsInDB())[0];
    await api
      .post(`/api/blogs/${targetBlog.id}/comments`)
      .set('Authorization', `bearer ${token}`)
      .send({ content: 'a comment' });

    const updatedBlog = {
      ...targetBlog,
      likes: targetBlog.likes + 3,
    };

    const response = await api
      .put(`/api/blogs/${targetBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const retrievedBlog = response.body;
    const comment = retrievedBlog.comments[0];

    expect(comment.content).toBeDefined();
    expect(comment.content).toBe('a comment');
  });
});
