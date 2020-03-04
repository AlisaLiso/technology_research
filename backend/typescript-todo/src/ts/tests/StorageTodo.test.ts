import * as fs from 'fs';
import FileStorageConfiguration from '../storage/FileStorageConfiguration';
import FileStorage from '../storage/FileStorage';

export default class StorageTest {
  private storage: FileStorage;
  private path: string;
  private finishTest: CallableFunction | any;
  private tasks: object[];
  private config: FileStorageConfiguration;

  constructor() {
    this.config = new FileStorageConfiguration({ storageDir: 'src/ts/storage' });
    this.storage = new FileStorage(this.config, 'test');
    this.path = 'src/ts/storage/test.json';
    this.tasks = [{ "id": 1234, "title": "title", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 12, "title": "title", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 123456, "title": "title3", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" },
    { "id": 123, "title": "title2", "created": "2020-02-27 20:12:42 Z", "updated": "2020-02-27 20:12:42 Z" }];
  }

  getTest() {
    fs.writeFile(this.path, JSON.stringify(this.tasks), 'utf8', () => {
      this.storage.get('id', 1234).then((data: object) => {
        this.assert("getTest", data, { "id": 1234, "title": "title", "created": "2020-02-28 20:12:02 Z", "updated": "2020-02-28 20:12:02 Z" });
      })
    });
  }

  pushTest() {
    const newObject = {
      "id": 12345,
      "title": "task two",
      "created": "2020-02-28 22:12:02 Z",
      "updated": "2020-02-28 22:12:02 Z"
    };

    this.storage.push(newObject).then((_: object) => {
      fs.readFile(this.path, 'utf8', (_err, data) => {
        this.assert("pushTest", JSON.parse(data), [newObject])
      })
    });
  }

  getAllTest() {
    fs.writeFile(this.path, JSON.stringify(this.tasks), 'utf8', () => {
      this.storage.getAll().then((_: object) => {
        fs.readFile(this.path, 'utf8', (_err, data) => {
          this.assert("getAllTest", JSON.parse(data), this.tasks);
        })
      });
    });
  }

  deleteTest() {
    fs.writeFile(this.path, JSON.stringify(this.tasks), 'utf8', () => {
      this.storage.delete('title', 'title').then((data: number) => {
        this.assert("deleteTest", data, 2);
      })
    });
  }

  updateTest() {
    const options = {
      "title": "New title",
      "updated": "2020-03-02 12:12:02 Z"
    };

    fs.writeFile(this.path, JSON.stringify(this.tasks), 'utf8', () => {
      this.storage.update('id', 12, options).then((data) => {
        this.assert("updateTest", data, 1);
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
      fs.unlink(this.path, (_err) => {
        testFunction.bind(this)();
      })
    })
  }

  static async run() {
    const storageTest = new StorageTest();
    const tests = [storageTest.getTest, storageTest.pushTest, storageTest.getAllTest, storageTest.deleteTest, storageTest.updateTest];

    for (const test of tests) {
      await storageTest.cleanUp(test).then(({ title, isSuccess, original = null, target = null }: { title: string, isSuccess: boolean, original: object | null, target: object | null }) => {
        if (isSuccess) {
          console.log(`${title}: Success`);
        } else {
          console.log(`${title}: ${original} not equal to ${target}`);
        }
      });
    }
  }
};
