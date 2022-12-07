const File = require("./File");

module.exports = class Directory {
  constructor(name, parentDir) {
    this.name = name;
    this.size = 0;
    this.parentDir = parentDir;
    this.directories = [];
    this.files = [];
  }

  hasFileWithName(name) {
    return this.files.find((f) => f.name === name);
  }

  addSize(size) {
    this.size += size;
    if (this.parentDir) {
      this.parentDir.addSize(size);
    }
  }

  addFile(name, size) {
    if (this.hasFileWithName(name)) return;

    this.addSize(size);
    this.files.push(new File(name, size, this));
  }

  hasDirWithName(name) {
    return this.directories.find((d) => d.name === name);
  }

  addSubDir(name) {
    if (this.hasDirWithName(name)) return null;
    const subDir = new Directory(name, this);
    this.directories.push(subDir);
    return subDir;
  }

  getOrAddSubDir(name) {
    if (!this.hasFileWithName(name)) {
      return this.addSubDir(name);
    }

    const idx = this.directories.findIndex((d) => d.name === name);
    return this.directories[idx];
  }

  getDirs() {
    let dirs = [];
    dirs.push(this);
    if (this.directories.length > 0) {
      this.directories.forEach((d) => {
        dirs.push(...d.getDirs());
      });
    }
    return dirs;
  }
};
