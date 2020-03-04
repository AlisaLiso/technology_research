"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fs = require("fs");
var FileStorage = /** @class */ (function () {
    function FileStorage(configuration, storageName) {
        this.filePath = configuration.tablePath(storageName);
    }
    FileStorage.prototype.get = function (key, value) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return fs.readFile(_this.filePath, 'utf8', function (err, data) {
            if (err)
                return reject(err);
            return resolve(data);
        }); });
        return Promise.all([promise]).then(function (data) {
            var parsedData = JSON.parse(data[0]);
            return parsedData.find(function (item) {
                return item[key] === value;
            });
        });
    };
    FileStorage.prototype.push = function (tasks) {
        var _this = this;
        var promise = new Promise(function (resolve, _reject) { return fs.readFile(_this.filePath, 'utf8', function (err, data) {
            if (err) {
                fs.writeFile(_this.filePath, '[]', 'utf8', function (_err) {
                    resolve('[]');
                });
            }
            else {
                resolve(data);
            }
        }); });
        return Promise.all([promise]).then(function (data) {
            var isArr = Object.prototype.toString.call(tasks) == '[object Array]';
            var parsedData = JSON.parse(data[0]);
            if (isArr) {
                for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
                    var task = tasks_1[_i];
                    parsedData.push(task);
                }
            }
            else {
                parsedData.push(tasks);
            }
            return new Promise(function (resolve, _reject) { return fs.writeFile(_this.filePath, JSON.stringify(parsedData), 'utf8', function () {
                return resolve(tasks);
            }); });
        });
    };
    FileStorage.prototype["delete"] = function (key, value) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return fs.readFile(_this.filePath, 'utf8', function (err, data) {
            if (err)
                return reject(err);
            return resolve(data);
        }); });
        return Promise.all([promise]).then(function (data) {
            var parsedData = JSON.parse(data[0]);
            var count = 0;
            parsedData.filter(function (item) {
                if (item[key] === value) {
                    count++;
                }
                return item[key] !== value;
            });
            return count;
        });
    };
    FileStorage.prototype.update = function (key, value, options) {
        var _this = this;
        var promise = new Promise(function (resolve, _reject) { return fs.readFile(_this.filePath, 'utf8', function (err, data) {
            if (err) {
                fs.writeFile(_this.filePath, '[]', 'utf8', function (_err) {
                    resolve('[]');
                });
            }
            else {
                resolve(data);
            }
        }); });
        return Promise.all([promise]).then(function (data) {
            var parsedData = JSON.parse(data[0]);
            var objectsForUpdate = [];
            var filteredList = parsedData.filter(function (item) {
                if (item[key] === value) {
                    objectsForUpdate.push(item);
                }
                ;
                return item[key] !== value;
            });
            var updatedObjects = objectsForUpdate.map(function (item) {
                for (var key in options) {
                    item[key] = options[key];
                }
                ;
            });
            return new Promise(function (resolve, _reject) { return fs.writeFile(_this.filePath, JSON.stringify(__spreadArrays(filteredList, updatedObjects)), 'utf8', function () {
                return resolve(updatedObjects.length);
            }); });
        });
    };
    FileStorage.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return fs.readFile(_this.filePath, 'utf8', function (err, data) {
            if (err)
                return reject(err);
            return resolve(data);
        }); });
        return Promise.all([promise]).then(function (data) {
            return JSON.parse(data[0]);
        });
    };
    return FileStorage;
}());
exports["default"] = FileStorage;
