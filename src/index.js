const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const checksExistsUserAccount = (request, response, next) => {
  const { username } = request.headers;

  const fetchUser = users.find((user) => user.username === username);

  if (!fetchUser) {
    return response.status(404).json({ error: "User does not exist !" });
  }

  request.user = fetchUser;

  return next();
};

const findUserTodo = ((user, id) => {
  return fetchedTodo = user.todos.find((todo) => todo.id === id);
});
app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists !" });
  }

  const newUserData = {
    id: uuid(), name, username, todos: [],
  }

  users.push(newUserData);

  return response.status(201).json(newUserData);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todoData = {
    id: uuid(), title, deadline: new Date(deadline), done: false, created_at: new Date()
  }
  user.todos.push(todoData);

  return response.status(201).json(todoData)
});


app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = findUserTodo(user, id);

  if (!todo) {
    return response.status(404).json({ error: "Does not exist any todo with the given id" });
  }
  todo.title = title ? title : todo.title;
  todo.deadline = todo.deadline === deadline ? todo.deadline : deadline;

  return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = findUserTodo(user, id);

  if (!todo) {
    return response.status(404).json({ error: "Does not exist any todo with the given id" });
  }

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const fetchedUserTodo = findUserTodo(user, id);

  if (!fetchedUserTodo) {
    return response.status(404).json({ error: "Does not exist any todo with the given id" });
  }

  user.todos.splice(fetchedUserTodo, 1);

  return response.status(204).send();
});

module.exports = app;