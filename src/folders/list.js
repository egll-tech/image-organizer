export async function listAllFolders(input, blacklist = []) {
  const folders = new Array();
  folders.push(input);
  const results = new Set();

  while (folders.length) {
    const folder = folders.pop();
    if (!results.has(folder) && !blacklists.includes(folder)) {
      results.add(folder);
    }

    await new Promise((resolve, reject) => {
      fs.readdir(
        folder,
        { encoding: "utf8", withFileTypes: true },
        (err, dirs) => {
          if (err) {
            reject(err);
          }

          if (dirs) {
            dirs.map((dir) =>
              dir.isDirectory()
                ? folders.push(path.resolve(input, folder, dir.name))
                : ""
            );
          }

          resolve(folder);
        }
      );
    });
  }
  return results;
}
