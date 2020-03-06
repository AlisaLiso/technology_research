import http = require("http");
import * as fs from 'fs';

const hostname = "0.0.0.0";
const port = 3000;
const todoTitle = 'New Static Title';

const optionsCreate = {
  hostname,
  port,
  path: '/todo',
  method: 'POST'
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
    const options = {
      hostname: '0.0.0.0',
      port: 3000,
      path: '/todo',
      method: 'POST'
    };

    const req = http.request(options, (res) => {
      res.on('data', (data) => {
        const stringData = JSON.parse(data.toString());
        this.assert("createTodoTest", stringData.title, todoTitle);
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  }

  deleteTodoTest() {
    const optionsDelete = {
      hostname,
      port,
      path: '/todo',
      method: 'DELETE'
    };

    const req = http.request(optionsCreate, (res) => {
      res.on('data', (data) => {
        const stringData = JSON.parse(data.toString());
        if (stringData.title === todoTitle) {
          const reqOnDelete = http.request(optionsDelete, (res) => {
            res.on('data', (data) => {
              const stringData = JSON.parse(data.toString());
              this.assert("deleteTodoTest", stringData, 1);
            });
          });

          reqOnDelete.on('error', (e) => {
            console.error(e);
          });
          reqOnDelete.end();
        }
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  }

  getTodoTest() {
    const req = http.request(optionsCreate, (res) => {
      res.on('data', (_data) => {
        const reqOnGet = http.request(optionsGet, (res) => {
          res.on('data', (data) => {
            const stringData = JSON.parse(data.toString());
            this.assert("getTodoTest", stringData.title, todoTitle);
          });
        });

        reqOnGet.on('error', (e) => {
          console.error(e);
        });
        reqOnGet.end();
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  }

  getAllTodoTest() {
    const req = http.request(optionsCreate, (res) => {
      res.on('data', (_data) => {
        const reqOnGetAll = http.request(optionsGetAll, (res) => {
          res.on('data', (data) => {
            const stringData = JSON.parse(data.toString());
            this.assert("getAllTodoTest", stringData[0].title, todoTitle);
          });
        });

        reqOnGetAll.on('error', (e) => {
          console.error(e);
        });
        reqOnGetAll.end();
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  }

  updateTodoTest() {
    const req = http.request(optionsCreate, (res) => {
      res.on('data', (data) => {
        const reqOnUpdate = http.request(optionsPatch, (res) => {
          res.on('data', (data) => {
            const stringData = JSON.parse(data.toString());
            this.assert("updateTodoTest", stringData, 1);
          });
        });

        reqOnUpdate.on('error', (e) => {
          console.error(e);
        });
        reqOnUpdate.end();
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
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
    const tests = [requestTests.createTodoTest, requestTests.deleteTodoTest, requestTests.getTodoTest, requestTests.updateTodoTest, requestTests.getAllTodoTest];

    for (const test of tests) {
      await requestTests.cleanUp(test).then(({ title, isSuccess, original = null, target = null }: { title: string, isSuccess: boolean, original: object | null, target: object | null }) => {
        if (isSuccess) {
          console.log(`${title}: Success`);
        } else {
          console.log(`${title}: ${original} not equal to ${target}`);
        }
      });
    }
  }
}
