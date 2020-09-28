const { isMedia } = require("../utils/regex");

export async function listAllMedia(folders) {
  const images = new Array();

  for (const folder of folders) {
    await new Promise((resolve, reject) => {
      fs.readdir(
        folder,
        { encoding: "utf8", withFileTypes: true },
        (err, items) => {
          if (err) {
            reject(err);
          }

          if (items) {
            items.map((item) =>
              item.isFile() && isMedia(item.name)
                ? images.push(path.resolve(folder, item.name))
                : ""
            );
          }

          resolve(folder);
        }
      );
    });
  }

  return images;
}
