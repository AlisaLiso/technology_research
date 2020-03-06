"use strict";
exports.__esModule = true;
var http = require("http");
var Todo_1 = require("./src/ts/components/Todo");
var todo = new Todo_1["default"]();
var hostname = "0.0.0.0";
var port = 3000;
var todoTitle = 'New Static Title';
var newTitle = "New title";
var createTodo = function (_req, res) {
    todo.create(todoTitle).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var deleteTodo = function (_req, res) {
    todo["delete"]("title", todoTitle).then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var getTodo = function (_req, res) {
    todo.get("title", todoTitle).then(function (data) {
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
    if (req.url === "/todo") {
        if (req.method === "POST") {
            createTodo(req, res);
        }
        else if (req.method === "DELETE") {
            deleteTodo(req, res);
        }
        else if (req.method === "GET") {
            getTodo(req, res);
        }
        else if (req.method === "PATCH") {
            updateTodo(req, res);
        }
    }
    else if (req.url === "/todos" && req.method === "GET") {
        getAllTodo(req, res);
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
