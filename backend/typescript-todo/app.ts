const http = require("http");
import Todo from './src/ts/components/Todo';
const todo = new Todo();

const hostname = "0.0.0.0";
const port = 3000;

class RequestTests {
  static createTodoTest() {
    const options = {
      hostname: '0.0.0.0',
      port: 3000,
      path: '/todo',
      method: 'POST'
    };

    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const stringData = JSON.parse(data.toString());
        console.log("createTodoTest:", stringData.title === 'Static title' && 'Success');
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  }
}

const createTodo = (req, res) => {
  todo.create('Static title').then((data) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  })
};

const handleRequest = (req, res) => {
  if (req.url === "/todo" && req.method === "POST") {
    createTodo(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Page doesn't exist");
  }
};

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  RequestTests.createTodoTest();
});
