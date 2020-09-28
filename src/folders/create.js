const fs = require("fs");

export function createFolder(path) {
  if (!fs.existsSync(output_path)) {
    fs.mkdirSync(output_path, { recursive: true });
  }
}
