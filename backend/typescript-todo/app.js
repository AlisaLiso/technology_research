"use strict";
exports.__esModule = true;
var http = require("http");
var Todo_1 = require("./src/ts/components/Todo");
var todo = new Todo_1["default"]();
var hostname = "0.0.0.0";
var port = 3000;
var RequestTests = /** @class */ (function () {
    function RequestTests() {
    }
    RequestTests.createTodoTest = function () {
        var options = {
            hostname: '0.0.0.0',
            port: 3000,
            path: '/todo',
            method: 'POST'
        };
        var req = http.request(options, function (res) {
            res.on('data', function (data) {
                var stringData = JSON.parse(data.toString());
                console.log("createTodoTest:", stringData.title === 'Static title' && 'Success');
            });
        });
        req.on('error', function (e) {
            console.error(e);
        });
        req.end();
    };
    return RequestTests;
}());
var createTodo = function (req, res) {
    todo.create('Static title').then(function (data) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};
var handleRequest = function (req, res) {
    if (req.url === "/todo" && req.method === "POST") {
        createTodo(req, res);
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
    RequestTests.createTodoTest();
});
