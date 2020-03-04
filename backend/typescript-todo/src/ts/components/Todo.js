"use strict";
exports.__esModule = true;
var FileStorage_1 = require("../storage/FileStorage");
var FileStorageConfiguration_1 = require("../storage/FileStorageConfiguration");
var Todo = /** @class */ (function () {
    function Todo() {
        this.config = new FileStorageConfiguration_1["default"]({ storageDir: 'src/ts/storage' });
        this.storage = new FileStorage_1["default"](this.config, 'todoListTest');
    }
    Todo.prototype.create = function (title) {
        var newTodo = {
            id: Math.random() * 100,
            title: title,
            created: new Date(),
            updated: new Date()
        };
        return this.storage.push(newTodo).then(function () {
            return newTodo;
        });
    };
    ;
    Todo.prototype["delete"] = function (key, value) {
        return this.storage["delete"](key, value).then(function (data) {
            return data;
        });
    };
    Todo.prototype.update = function (key, value, options) {
        return this.storage.update(key, value, options);
    };
    Todo.prototype.getAll = function () {
        return this.storage.getAll();
    };
    Todo.prototype.get = function (key, value) {
        return this.storage.get(key, value);
    };
    return Todo;
}());
exports["default"] = Todo;
// StorageTest.run();
// TodoTests.run();
