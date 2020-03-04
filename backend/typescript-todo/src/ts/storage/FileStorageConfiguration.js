"use strict";
exports.__esModule = true;
var FileStorageConfiguration = /** @class */ (function () {
    function FileStorageConfiguration(options) {
        this.storageDir = options.storageDir;
    }
    FileStorageConfiguration.prototype.tablePath = function (tableName) {
        return this.storageDir + "/" + tableName + ".json";
    };
    return FileStorageConfiguration;
}());
exports["default"] = FileStorageConfiguration;
