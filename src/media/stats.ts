import fs from 'fs';

export async function getStats(filename: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}
