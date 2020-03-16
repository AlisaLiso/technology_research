import * as fs from 'fs';
import FileStorageConfiguration from '../storage/FileStorageConfiguration';

export default class FileStorage {
  private filePath: string;

  constructor(configuration: FileStorageConfiguration, storageName: string) {
    this.filePath = configuration.tablePath(storageName);
  }

  get(key: string, value: number | string): Promise<object> {
    const promise: Promise<string> = new Promise((resolve, reject) => fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    }));

    return Promise.all([promise]).then((data: string[]): Promise<object> => {
      const parsedData = JSON.parse(data[0]);
      return parsedData.find((item: { [key: string]: number | string }): boolean => {
        return item[key] === value;
      });
    })
  }

  push(tasks: object[] | object): Promise<object> {
    const promise: Promise<string> = new Promise((resolve, _reject) => fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        fs.writeFile(this.filePath, '[]', 'utf8', (_err) => {
          resolve('[]')
        });
      } else {
        resolve(data);
      }
    }));

    return Promise.all([promise]).then((data: string[]): Promise<object> => {
      var isArr = Object.prototype.toString.call(tasks) == '[object Array]';

      const parsedData: object[] = JSON.parse(data[0]);
      if (isArr) {
        for(const task of tasks) {
          parsedData.push(task);
        }
      } else {
        parsedData.push(tasks);
      }

      return new Promise((resolve, _reject) => fs.writeFile(this.filePath, JSON.stringify(parsedData), 'utf8', () => {
        return resolve(tasks);
      }));
    })
  }

  delete(key: string, value: number | string): Promise<number> {
    const promise: Promise<string> = new Promise((resolve, reject) => fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    }));

    return Promise.all([promise]).then((data: string[]): number => {
      const parsedData = JSON.parse(data[0]);

      let count = 0;
      parsedData.filter((item: { [key: string]: number | string }): boolean => {
        if (item[key] === value) {
          count++;
        }
        return item[key] !== value;
      });

      return count;
    })
  }

  update(key: string, value: number | string, options: { [key: string]: number | string | Date }): Promise<number> {
    const promise: Promise<string> = new Promise((resolve, _reject) => fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        fs.writeFile(this.filePath, '[]', 'utf8', (_err) => {
          resolve('[]')
        });
      } else {
        resolve(data);
      }
    }));

    return Promise.all([promise]).then((data: string[]): Promise<number> => {
      const parsedData: { [key: string]: number | string }[] = JSON.parse(data[0]);

      let objectsForUpdate: { [key: string]: number | string }[] = [];
      const filteredList: object[] = parsedData.filter((item: { [key: string]: number | string }) => {
        if (item[key] === value) {
          objectsForUpdate.push(item);
        };
        return item[key] !== value;
      });

      const updatedObjects = objectsForUpdate.map((item: { [key: string]: number | string | Date }) => {
        for (var key in options) {
          item[key] = options[key];
        };
      })

      return new Promise((resolve, _reject) => fs.writeFile(this.filePath, JSON.stringify([...filteredList, ...updatedObjects]), 'utf8', () => {
        return resolve(updatedObjects.length);
      }));
    })
  }

  getAll(): Promise<object[]> {
    const promise: Promise<string> = new Promise((resolve, reject) => fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    }));

    return Promise.all([promise]).then((data: string[]): Promise<object[]> => {
      return JSON.parse(data[0]);
    })
  }
}
