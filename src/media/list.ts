import { isMedia } from '../utils/regex';
import fs from 'fs';
import path from 'path';

export async function listAllMedia(folders: Set<string>): Promise<string[]> {
  const images: string[] = [];

  for (const folder of Array.from(folders)) {
    await new Promise((resolve, reject) => {
      fs.readdir(
        folder,
        { encoding: 'utf8', withFileTypes: true },
        (err, items) => {
          if (err) {
            reject(err);
          }

          if (items) {
            items.map(item =>
              item.isFile() && isMedia(item.name)
                ? images.push(path.resolve(folder, item.name))
                : ''
            );
          }

          resolve(folder);
        }
      );
    });
  }

  return images;
}
