import FileStorage from '../storage/FileStorage';
import FileStorageConfiguration from '../storage/FileStorageConfiguration';

export default class Todo {
  storage: FileStorage;
  config: FileStorageConfiguration;

  constructor() {
    this.config = new FileStorageConfiguration({ storageDir: 'src/ts/storage' });
    this.storage = new FileStorage(this.config, 'todoListTest');
  }

  create(title: string) {
    const newTodo = {
      id: Math.random() * 100,
      title: title,
      created: new Date(),
      updated: new Date()
    };

    return this.storage.push(newTodo).then(() => {
      return newTodo;
    })
  };

  delete(key: string, value: string | number) {
    return this.storage.delete(key, value).then((data) => {
      return data;
    })
  }

  update(key: string, value: number | string, options: { [key: string]: string | number | Date }) {
    return this.storage.update(key, value, options);
  }

  getAll() {
    return this.storage.getAll();
  }

  get(key: string, value: number | string) {
    return this.storage.get(key, value);
  }
}

// StorageTest.run();
// TodoTests.run();
