/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce(((prev, curr) => prev + curr.likes), 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const max = blogs.reduce((prev, curr) => (prev.likes > curr.likes ? prev : curr));

  return max;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCount = {};
  blogs.forEach((blog) => { authorCount[blog.author] = (authorCount[blog.author] ?? 0) + 1; });

  const maxAuthorKey = Object.keys(authorCount).reduce((prevAuthor, currAuthor) => (authorCount[prevAuthor] > authorCount[currAuthor] ? prevAuthor : currAuthor));

  return {
    author: maxAuthorKey,
    blogs: authorCount[maxAuthorKey],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorLikeCount = {};
  blogs.forEach((blog) => {
    authorLikeCount[blog.author] = (authorLikeCount[blog.author] ?? 0) + blog.likes;
  });

  const maxAuthorKey = Object.keys(authorLikeCount).reduce((prevAuthor, currAuthor) => (authorLikeCount[prevAuthor] > authorLikeCount[currAuthor] ? prevAuthor : currAuthor));

  return {
    author: maxAuthorKey,
    likes: authorLikeCount[maxAuthorKey],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,

};
