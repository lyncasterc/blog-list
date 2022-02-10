import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    creator: 'admin',
    url: 'coolurl.com',
    id: 'testid1',
    updateLikes: jest.fn(),
    destroyBlog: jest.fn(),
    likes: 0,
  };

  test('renders only title and author at start', () => {
    render(
      <Blog
        title={blog.title}
        author={blog.author}
        creator={blog.creator}
        url={blog.url}
        id={blog.id}
        likes={blog.likes}
        destroyBlog={blog.destroyBlog}
        updateLikes={blog.updateLikes}
      />,
    );

    expect(screen.getByText(/Test Title/)).toBeVisible();
    expect(screen.getByText(/Test Author/)).toBeVisible();

    expect(screen.queryByText(/admin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/coolurl/)).not.toBeInTheDocument();
    expect(screen.queryByText('delete')).not.toBeInTheDocument();
    expect(screen.queryByText(/like/)).not.toBeInTheDocument();
  });

  test('renders url and likes when button is clicked', () => {
    render(
      <Blog
        title={blog.title}
        author={blog.author}
        creator={blog.creator}
        url={blog.url}
        id={blog.id}
        likes={blog.likes}
        destroyBlog={blog.destroyBlog}
        updateLikes={blog.updateLikes}
      />,
    );

    const showButton = screen.getByText('show');
    userEvent.click(showButton);

    expect(screen.getByText(/admin/)).toBeInTheDocument();
    expect(screen.getByText(/coolurl/)).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    expect(screen.getByText('like')).toBeInTheDocument();
    expect(screen.getByText(/likes:/)).toBeInTheDocument();
  });

  test('clicking like button twice fires handler twice', () => {
    render(
      <Blog
        title={blog.title}
        author={blog.author}
        creator={blog.creator}
        url={blog.url}
        id={blog.id}
        likes={blog.likes}
        destroyBlog={blog.destroyBlog}
        updateLikes={blog.updateLikes}
      />,
    );

    const showButton = screen.getByText('show');
    userEvent.click(showButton);
    const likeButton = screen.getByText('like');
    userEvent.click(likeButton);
    userEvent.click(likeButton);

    expect(blog.updateLikes.mock.calls).toHaveLength(2);
  });
});
