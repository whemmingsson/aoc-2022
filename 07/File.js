module.exports = class File {
  constructor(name, size, parentDir) {
    this.name = name;
    this.size = size;
    this.parentDir = parentDir;
  }
};
