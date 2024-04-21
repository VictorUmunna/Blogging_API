const express = require('express')
const blogRouter = express.Router();

blogRouter.get('/', () => {
  // Function for getting all available blogs
  res.send('Gets all available articles')
});

blogRouter.get('/user', () => {
  // Function for getting all the articles by a user
  res.send('Gets all articles by a user')
});

blogRouter.get('/:id', () => {
  // Function for getting an article by id
  res.send('Gets an article by id')
});

blogRouter.post('/', () => {
  // Function for creating a new article
  res.send('Creates a new article')
});

blogRouter.delete('/:id', () => {
  // Function for updating an article
  res.send('Updates an article')
});

blogRouter.patch('/:id', () => {
  // Function for deleting an article
  res.send('Deletes an article')
});

module.exports = blogRouter;
