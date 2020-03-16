import http = require("http");
import Todo from './src/ts/components/Todo';

import RequestTests from './__tests__/Request.test';
const todo = new Todo();

const hostname = "0.0.0.0";
const port = 3000;

const createTodo = (_req, res, data) => { // curl -X PUT -H "Content-Type: application/json" -d '{"title":"Make chocolat tart"}' http://0.0.0.0:3000/todo
  todo.create(data.title).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
};

const deleteTodo = (_req, res, match) => {
  const idTodo = parseFloat(match[0]);

  todo.delete("id", idTodo).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const getTodo = (_req, res, match) => {
  const idTodo = parseFloat(match[0]);

  todo.get("id", idTodo).then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  });
}

const updateTodo = (_req, res, match, parsedData) => {
  const idTodo = parseFloat(match[0]);

  todo.update("id", idTodo, parsedData).then((data) => {
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
  const match = req.url.match(/\d.+$/);

  if (req.url === "/todo" && req.method === "PUT") { // POST TODO
    let data = []
    req.on('data', chunk => {
      data.push(chunk)
    })
    req.on('end', () => {
      let parsedData = JSON.parse(data);
      createTodo(req, res, parsedData);
    })
  } else if (match && req.method === "DELETE") {
    deleteTodo(req, res, match);
  } else if (match && req.method === "GET") {
    getTodo(req, res, match);
  } else if (req.url === "/todo" && req.method === "GET") {
    getAllTodo(req, res);
  } else if (match && req.method === "POST") {
    let data = []
    req.on('data', chunk => {
      data.push(chunk)
    })
    req.on('end', () => {
      let parsedData = JSON.parse(data);
      updateTodo(req, res, match, parsedData);
    })
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Page doesn't exist");
  }

};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

RequestTests.run();
