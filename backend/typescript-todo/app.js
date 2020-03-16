"use strict";
exports.__esModule = true;
var http = require("http");
var Todo_1 = require("./src/ts/components/Todo");
var Request_test_1 = require("./__tests__/Request.test");
var todo = new Todo_1["default"]();
var hostname = "0.0.0.0";
var port = 3000;
var todoTitle = 'New Static Title';
var newTitle = "New title";
var createTodo = function (_req, res, data) {
    todo.create(data.title).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var deleteTodo = function (_req, res, match) {
    var idTodo = parseFloat(match[0]);
    todo["delete"]("id", idTodo).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var getTodo = function (_req, res, match) {
    var idTodo = parseFloat(match[0]);
    todo.get("id", idTodo).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var updateTodo = function (_req, res) {
    var options = {
        title: newTitle,
        updated: new Date()
    };
    todo.update("title", todoTitle, options).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var getAllTodo = function (_req, res) {
    todo.getAll().then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var handleRequest = function (req, res) {
    var match = req.url.match(/\d.+$/);
    if (req.url === "/todo" && req.method === "PUT") { // POST TODO
        var data_1 = [];
        req.on('data', function (chunk) {
            data_1.push(chunk);
        });
        req.on('end', function () {
            var parsedData = JSON.parse(data_1);
            createTodo(req, res, parsedData);
        });
    }
    else if (match && req.method === "DELETE") {
        deleteTodo(req, res, match);
    }
    else if (match && req.method === "GET") {
        getTodo(req, res, match);
    }
    else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Page doesn't exist");
    }
};
var server = http.createServer(handleRequest);
server.listen(port, hostname, function () {
    console.log("Server running at http://" + hostname + ":" + port + "/");
});
Request_test_1["default"].run();
// } else if (req.method === "PATCH") {
//   updateTodo(req, res);
// }
// } else if (req.url === "/todos" && req.method === "GET") {
// getAllTodo(req, res);
// } else {
