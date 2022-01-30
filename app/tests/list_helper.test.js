const listHelper = require('../utils/list_helper');

const {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
} = listHelper;

test('dummy returns one', () => {
  const blogs = [];
  expect(dummy(blogs)).toBe(1);
});

describe('totalLikes', () => {
  test('of empty blogs list is 0', () => {
    expect(totalLikes([])).toBe(0);
  });

  test('of one blog is equal to that blog\'s likes', () => {
    const blog = {
      likes: 2,
    };
    const { likes } = blog;

    expect(totalLikes([blog])).toBe(likes);
  });

  test('of many blogs is calculated correctly', () => {
    const blogs = [1, 2, 3, 4, 5].map((num) => ({ likes: num }));
    expect(totalLikes(blogs)).toBe(15);
  });
});

describe('favoriteBlog', () => {
  const listWithOneBlog = [
    {
      title: 'foo',
      author: 'bar',
      likes: 10,
    },
  ];

  const listWithManyBlogs = [
    {
      title: 'foobar',
      author: 'barfoo',
      likes: 2,
    },

    {
      title: 'foobar? maybe not',
      author: 'foobar',
      likes: 12,
    },

    {
      title: 'hello',
      author: 'greeter',
      likes: 1,
    },
  ];

  test('of empty list is null', () => {
    expect(favoriteBlog([])).toBeNull();
  });

  test('of list with one blog to be that blog', () => {
    expect(favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0]);
  });

  test('of list with many blogs to be the blog with most likes', () => {
    expect(favoriteBlog(listWithManyBlogs)).toEqual(listWithManyBlogs[1]);
  });
});

describe('mostBlogs', () => {
  const listWithOneBlog = [
    {
      title: 'foo',
      author: 'bar',
      likes: 10,
    },
  ];

  const listWithManyBlogs = [
    {
      title: 'foobar',
      author: 'no foo',
      likes: 2,
    },

    {
      title: 'foobar? maybe not',
      author: 'no foo',
      likes: 12,
    },

    {
      title: 'hello',
      author: 'greeter',
      likes: 1,
    },
  ];

  test('author of most blogs in empty list is null', () => {
    expect(mostBlogs([])).toBeNull();
  });

  test('author of most blogs in list with one blog to be that author', () => {
    const { author } = listWithOneBlog[0];
    const blogs = listWithOneBlog.length;

    expect(mostBlogs(listWithOneBlog)).toEqual({ author, blogs });
  });

  test('author of most blogs in list with many blogs to be correct', () => {
    const { author } = listWithManyBlogs[1];
    const blogs = 2;

    expect(mostBlogs(listWithManyBlogs)).toEqual({ author, blogs });
  });
});

describe('mostLikes', () => {
  const listWithOneBlog = [
    {
      title: 'foo',
      author: 'bar',
      likes: 10,
    },
  ];

  const listWithManyBlogs = [
    {
      title: 'foobar',
      author: 'no foo',
      likes: 15,
    },

    {
      title: 'foobar? maybe not',
      author: 'no foo',
      likes: 15,
    },

    {
      title: 'hello',
      author: 'greeter',
      likes: 20,
    },
  ];

  test('author with most likes in empty list is null', () => {
    expect(mostLikes([])).toBeNull();
  });

  test('author with most likes in list with one blog is that author', () => {
    const { author, likes } = listWithOneBlog[0];

    expect(mostLikes(listWithOneBlog)).toEqual({ author, likes });
  });

  test('author with most likes in list with many blogs to be correct', () => {
    const { author } = listWithManyBlogs[0];
    const likes = 30;

    expect(mostLikes(listWithManyBlogs)).toEqual({ author, likes });
  });
});
