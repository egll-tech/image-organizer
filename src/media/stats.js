const fs = require("fs");

export async function getStats(filename) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}
