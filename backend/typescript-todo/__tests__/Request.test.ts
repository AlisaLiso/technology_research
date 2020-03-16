import http = require("http");
import * as fs from 'fs';

import Todo from '../src/ts/components/Todo';
const todo = new Todo();

const hostname = "0.0.0.0";
const port = 3000;
const todoTitle = 'Hello world!';

const options = {
  hostname,
  port
};

const optionsGet = {
  hostname,
  port,
  path: '/todo',
  method: 'GET'
};

const optionsPatch = {
  hostname,
  port,
  path: '/todo',
  method: 'PATCH'
};

const optionsGetAll = {
  hostname,
  port,
  path: '/todos',
  method: 'GET'
};

export default class RequestTests {
  private finishTest: CallableFunction | any;

  createTodoTest() {
    const postData = JSON.stringify({
      'title': todoTitle
    });

    const req = http.request({
      ...options, path: '/todo', method: 'PUT', headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      res.on('data', (data) => {
        const stringData = JSON.parse(data.toString());
        this.assert("createTodoTest", stringData.title, todoTitle);
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.write(postData);
    req.end();
  }

  deleteTodoTest() {
    const newTodo = todo.create(todoTitle);
    newTodo.then((data) => {
      const req = http.request({
        ...options, path: `/todo/${data.id}`, method: 'DELETE', headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', (data) => {
          const stringData = JSON.parse(data.toString());
          this.assert("deleteTodoTest", stringData, 1);
        });
      });

      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
    });
  }

  getTodoTest() {
    const newTodo = todo.create(todoTitle);
    newTodo.then((data) => {
      const req = http.request({
        ...options, path: `/todo/${data.id}`, method: 'GET', headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', (data) => {
          const stringData = JSON.parse(data.toString());
          this.assert("getTodoTest", stringData.title, todoTitle);
        });
      });

      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
    });
  }

  getAllTodoTest() {
    const newTodo = todo.create(todoTitle);
    newTodo.then((_data) => {
      const req = http.request({
        ...options, path: `/todo`, method: 'GET', headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', (data) => {
          const stringData = JSON.parse(data.toString());
          this.assert("getAllTodoTest", stringData[0].title, todoTitle);
        });
      });

      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
    });
  }

  updateTodoTest() {
    const postData = JSON.stringify({
      'title': 'New title'
    });

    const newTodo = todo.create(todoTitle);
    newTodo.then((data) => {
      const req = http.request({
        ...options, path: `/todo/${data.id}`, method: 'POST', headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', (data) => {
          const stringData = JSON.parse(data.toString());
          this.assert("updateTodoTest", stringData, 1);
        });
      });

      req.on('error', (e) => {
        console.error(e);
      });
      req.write(postData);
      req.end();
    });
  }

  assert(title: string, original: object | number, target: string | number | object) {
    if (original === target) {
      let params = {
        title,
        isSuccess: true
      }
      this.finishTest(params);
    } else {
      let params = {
        title,
        isSuccess: false,
        original,
        target
      }
      this.finishTest(params);
    }
  }

  cleanUp(testFunction: CallableFunction): Promise<{ title: string, isSuccess: boolean, original: object | null, target: object | null }> {
    return new Promise((resolve, _reject) => {
      this.finishTest = resolve;
      fs.unlink('src/ts/storage/todoListTest.json', (_err) => {
        testFunction.bind(this)();
      })
    })
  }

  static async run() {
    const requestTests = new RequestTests();
    const tests = [requestTests.createTodoTest, requestTests.deleteTodoTest, requestTests.getTodoTest, requestTests.getAllTodoTest, requestTests.updateTodoTest];

    for (const test of tests) {
      await requestTests.cleanUp(test).then(({ title, isSuccess, original = null, target = null }: { title: string, isSuccess: boolean, original: object | null, target: object | null }) => {
        if (isSuccess) {
          console.log(`${title}:`, '\u001b[32;1m • \u001b[0m');
        } else {
          console.log(`${title}: \u001b[31;1m ${original} not equal to ${target} \u001b[0m`);
        }
      });
    }
  }
}
