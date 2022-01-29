const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: {
    type: String,
    required: [true, 'Link a URL to this blog!'],
  },
  likes: Number,
});

module.exports = mongoose.model('Blog', blogSchema);
