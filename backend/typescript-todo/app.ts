import http = require("http");
import Todo from './src/ts/components/Todo';

import RequestTests from './__tests__/Request.test';
const todo = new Todo();

const hostname = "0.0.0.0";
const port = 3000;
const todoTitle = 'New Static Title';
const newTitle = "New title";

const createTodo = (_req, res, data) => { // curl -X PUT -H "Content-Type: application/json" -d '{"title":"Make chocolat tart"}' http://0.0.0.0:3000/todo
  todo.create(data.title).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
};

const deleteTodo = (_req, res) => {
  todo.delete("title", todoTitle).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const getTodo = (_req, res) => {
  todo.get("title", todoTitle).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const updateTodo = (_req, res) => {
  const options = {
    title: newTitle,
    updated: new Date()
  };

  todo.update("title", todoTitle, options).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const getAllTodo = (_req, res) => {
  todo.getAll().then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const handleRequest = (req, res) => {
  let data = []
  req.on('data', chunk => {
    data.push(chunk)
  })
  req.on('end', () => {
    let parsedData = JSON.parse(data);
    if (req.url === "/todo" && req.method === "PUT") { // POST TODO
      createTodo(req, res, parsedData);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("Page doesn't exist");
    }
  })

};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

RequestTests.run()
// if (req.method === "DELETE") {
//   deleteTodo(req, res);
// } else if (req.method === "GET") {
//   getTodo(req, res);
// } else if (req.method === "PATCH") {
//   updateTodo(req, res);
// }
// } else if (req.url === "/todos" && req.method === "GET") {
// getAllTodo(req, res);
// } else {
