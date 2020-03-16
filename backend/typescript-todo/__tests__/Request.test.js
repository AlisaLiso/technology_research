"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var Todo_1 = require("../src/ts/components/Todo");
var todo = new Todo_1["default"]();
var hostname = "0.0.0.0";
var port = 3000;
var todoTitle = 'Hello world!';
var options = {
    hostname: hostname,
    port: port
};
var optionsGet = {
    hostname: hostname,
    port: port,
    path: '/todo',
    method: 'GET'
};
var optionsPatch = {
    hostname: hostname,
    port: port,
    path: '/todo',
    method: 'PATCH'
};
var optionsGetAll = {
    hostname: hostname,
    port: port,
    path: '/todos',
    method: 'GET'
};
var RequestTests = /** @class */ (function () {
    function RequestTests() {
    }
    RequestTests.prototype.createTodoTest = function () {
        var _this = this;
        var postData = JSON.stringify({
            'title': todoTitle
        });
        var req = http.request(__assign(__assign({}, options), { path: '/todo', method: 'PUT', headers: {
                'Content-Type': 'application/json'
            } }), function (res) {
            res.on('data', function (data) {
                var stringData = JSON.parse(data.toString());
                _this.assert("createTodoTest", stringData.title, todoTitle);
            });
        });
        req.on('error', function (e) {
            console.error(e);
        });
        req.write(postData);
        req.end();
    };
    RequestTests.prototype.deleteTodoTest = function () {
        var _this = this;
        var newTodo = todo.create(todoTitle);
        newTodo.then(function (data) {
            var req = http.request(__assign(__assign({}, options), { path: "/todo/" + data.id, method: 'DELETE', headers: {
                    'Content-Type': 'application/json'
                } }), function (res) {
                res.on('data', function (data) {
                    var stringData = JSON.parse(data.toString());
                    _this.assert("deleteTodoTest", stringData, 1);
                });
            });
            req.on('error', function (e) {
                console.error(e);
            });
            req.end();
        });
    };
    RequestTests.prototype.getTodoTest = function () {
        var _this = this;
        var newTodo = todo.create(todoTitle);
        newTodo.then(function (data) {
            var req = http.request(__assign(__assign({}, options), { path: "/todo/" + data.id, method: 'GET', headers: {
                    'Content-Type': 'application/json'
                } }), function (res) {
                res.on('data', function (data) {
                    var stringData = JSON.parse(data.toString());
                    _this.assert("getTodoTest", stringData.title, todoTitle);
                });
            });
            req.on('error', function (e) {
                console.error(e);
            });
            req.end();
        });
    };
    RequestTests.prototype.getAllTodoTest = function () {
        var _this = this;
        var newTodo = todo.create(todoTitle);
        newTodo.then(function (_data) {
            var req = http.request(__assign(__assign({}, options), { path: "/todo", method: 'GET', headers: {
                    'Content-Type': 'application/json'
                } }), function (res) {
                res.on('data', function (data) {
                    var stringData = JSON.parse(data.toString());
                    _this.assert("getAllTodoTest", stringData[0].title, todoTitle);
                });
            });
            req.on('error', function (e) {
                console.error(e);
            });
            req.end();
        });
    };
    RequestTests.prototype.updateTodoTest = function () {
        var _this = this;
        var postData = JSON.stringify({
            'title': 'New title'
        });
        var newTodo = todo.create(todoTitle);
        newTodo.then(function (data) {
            var req = http.request(__assign(__assign({}, options), { path: "/todo/" + data.id, method: 'POST', headers: {
                    'Content-Type': 'application/json'
                } }), function (res) {
                res.on('data', function (data) {
                    var stringData = JSON.parse(data.toString());
                    _this.assert("updateTodoTest", stringData, 1);
                });
            });
            req.on('error', function (e) {
                console.error(e);
            });
            req.write(postData);
            req.end();
        });
    };
    RequestTests.prototype.assert = function (title, original, target) {
        if (original === target) {
            var params = {
                title: title,
                isSuccess: true
            };
            this.finishTest(params);
        }
        else {
            var params = {
                title: title,
                isSuccess: false,
                original: original,
                target: target
            };
            this.finishTest(params);
        }
    };
    RequestTests.prototype.cleanUp = function (testFunction) {
        var _this = this;
        return new Promise(function (resolve, _reject) {
            _this.finishTest = resolve;
            fs.unlink('src/ts/storage/todoListTest.json', function (_err) {
                testFunction.bind(_this)();
            });
        });
    };
    RequestTests.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestTests, tests, _i, tests_1, test;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestTests = new RequestTests();
                        tests = [requestTests.createTodoTest, requestTests.deleteTodoTest, requestTests.getTodoTest, requestTests.getAllTodoTest, requestTests.updateTodoTest];
                        _i = 0, tests_1 = tests;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tests_1.length)) return [3 /*break*/, 4];
                        test = tests_1[_i];
                        return [4 /*yield*/, requestTests.cleanUp(test).then(function (_a) {
                                var title = _a.title, isSuccess = _a.isSuccess, _b = _a.original, original = _b === void 0 ? null : _b, _c = _a.target, target = _c === void 0 ? null : _c;
                                if (isSuccess) {
                                    console.log(title + ":", '\u001b[32;1m • \u001b[0m');
                                }
                                else {
                                    console.log(title + ": \u001B[31;1m " + original + " not equal to " + target + " \u001B[0m");
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RequestTests;
}());
exports["default"] = RequestTests;
