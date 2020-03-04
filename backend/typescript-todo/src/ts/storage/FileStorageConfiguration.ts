export default class FileStorageConfiguration {
  public storageDir: string;

  constructor(options: { [key: string]: string }) {
    this.storageDir = options.storageDir;
  }

  tablePath(tableName: string) {
    return `${this.storageDir}/${tableName}.json`;
  }
}
