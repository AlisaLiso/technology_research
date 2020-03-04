import * as fs from 'fs';
import FileStorageConfiguration from '../storage/FileStorageConfiguration';
import FileStorage from '../storage/FileStorage';
import Todo from '../components/Todo';

export default class TodoTests {
  private storage: FileStorage;
  private finishTest: CallableFunction | any;
  private config: FileStorageConfiguration;
  private todo: Todo;
  private tasks: object[];

  constructor() {
    this.config = new FileStorageConfiguration({ storageDir: 'src/ts/storage' });
    this.storage = new FileStorage(this.config, 'todoListTest');
    this.todo = new Todo();
    this.tasks = [{ "id": 1234, "title": "title", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 12, "title": "title", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 123456, "title": "title3", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 123, "title": "title2", "created": "2020-02-27 20:12:42 Z", "updated": "2020-02-27 20:12:42 Z" }];
  }

  createTodoTest() {
    const taskName = "Clean appartment";

    this.todo.create(taskName).then((task) => {
      this.storage.get('title', taskName).then((data) => {
        this.assert('createTodoTest', task, data);
      });
    })
  }

  deleteTodoTest() {
    const newTask = {
      id: 89.04837631487048,
      title: 'New task for tuesday',
      created: new Date(),
      updated: new Date()
    };

    this.storage.push(newTask).then((_data) => {
      this.todo.delete('id', 89.04837631487048).then((task) => {
        this.assert('deleteTodoTest', task, 1);
      })
    });
  }

  updateTodoTest() {
    const newTask = {
      id: 89,
      title: 'New task for monday',
      created: new Date(),
      updated: new Date()
    };
    const options = {
      title: "New title",
      updated: new Date()
    };

    this.storage.push(newTask).then((_data) => {
      this.todo.update('id', 89, options).then((task) => {
        this.assert('updateTodoTest', task, 1);
      })
    })
  }

  getAllTodoTest() {
    this.storage.push(this.tasks).then((_data) => {
      this.todo.getAll().then((data: object[]) => {
        this.assert('getAllTodoTest', this.tasks, data);
      })
    });
  }

  getTodoTest() {
    const newTask = {
      id: 89.048376,
      title: 'New task for tuesday 2',
      created: new Date(),
      updated: new Date()
    };

    this.storage.push(newTask).then((_data) => {
      this.todo.get('id', 89.048376).then((data) => {
        this.assert('getTodoTest', newTask, data);
      })
    });

  }

  assert(title: string, original: object | number, target: object | number) {
    if (Object.is(JSON.stringify(original), JSON.stringify(target))) {
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
    const todoTest = new TodoTests();
    const tests = [todoTest.createTodoTest, todoTest.deleteTodoTest, todoTest.getAllTodoTest, todoTest.getTodoTest, todoTest.updateTodoTest];

    for (const test of tests) {
      await todoTest.cleanUp(test).then(({ title, isSuccess, original = null, target = null }: { title: string, isSuccess: boolean, original: object | null, target: object | null }) => {
        if (isSuccess) {
          console.log(`${title}: Success`);
        } else {
          console.log(`${title}: ${original} not equal to ${target}`);
        }
      });
    }
  }
};
