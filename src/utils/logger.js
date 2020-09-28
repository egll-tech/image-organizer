const defaults = require("../utils/defaults.json");
const fs = require("fs");
const path = require("path");

export class Logger {
  static stream = null;
  static isNew = false;
  static log = defaults.log;

  static start(output = __dirname) {
    log = path.join(output, defaults.log);
    isNew = fs.existsSync(log);
  }

  static log(...text) {
    if (!stream) {
      this.stream = fs.createWriteStream(log);
    }

    if (this.isNew) {
      this.stream.write(text);
      this.isNew = false;
    } else {
      this.stream.write(`\n${text}`);
    }
  }

  static end() {
    if (this.strea) this.stream.end();
  }
}
