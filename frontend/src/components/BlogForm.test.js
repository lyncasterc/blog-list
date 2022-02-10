import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm/>', () => {
  test('submitting form calls createBlog function with correct arguments', () => {
    const createBlog = jest.fn();
    render(
      <BlogForm createBlog={createBlog} />,
    );

    const submitButton = screen.getByText('Save');

    userEvent.type(screen.getByPlaceholderText('Enter Title'), 'test title');
    userEvent.type(screen.getByPlaceholderText('Enter Author'), 'test author');
    userEvent.type(screen.getByPlaceholderText('Enter url'), 'test url');

    userEvent.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({ title: 'test title', author: 'test author', url: 'test url' });
  });
});
