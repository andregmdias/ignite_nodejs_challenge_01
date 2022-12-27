const express = require('express');
const cors = require('cors');
  
const {v4: uuidv4} = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const checksExistsUserAccount = (request, response, next) => {
  const {username} = request.headers;

  const fetchUser = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({error: "User does not exist !"})
  }

  request.user = fetchUser;

  return next();
};

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  
  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(201).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;

  user.todos.push({
    id: uuidv4,
    title,
    deadline,
    created_at_at:new Date()
  });

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

app.listen(3333);