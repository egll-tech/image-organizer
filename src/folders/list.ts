import fs from 'fs';
import path from 'path';

export async function listAllFolders(
  input: string,
  blacklist: string[] = []
): Promise<Set<string>> {
  const folders = new Array();
  folders.push(input);
  const results = new Set<string>();

  while (folders.length) {
    const folder = folders.pop();
    if (!results.has(folder) && !blacklist.includes(folder)) {
      results.add(folder);
    }

    await new Promise((resolve, reject) => {
      fs.readdir(
        folder,
        { encoding: 'utf8', withFileTypes: true },
        (err, dirs) => {
          if (err) {
            reject(err);
          }

          if (dirs) {
            dirs.map(dir =>
              dir.isDirectory()
                ? folders.push(path.resolve(input, folder, dir.name))
                : ''
            );
          }

          resolve(folder);
        }
      );
    });
  }
  return results;
}
