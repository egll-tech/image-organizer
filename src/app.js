const fs = require("fs");
const ora = require("ora");
const path = require("path");
const moment = require("moment");

const args = process.argv.slice(2);
const IMG_REGEX = new RegExp(
  /\.(gif|jpe?g|tiff?|png|webp|bmp|jfif|exif|ppm|pgm|pbm|pnm|hdr|heif|img|bpg|drw|ico)$/gi
);
const DATE_REGEX = new RegExp(/\d{8}/g);

const spinner_options = {
  color: "magenta",
  spinner: "arc",
};

const UNCLASSIFIED_FOLDER = "UNKNOWN";

const isImage = (filename) => {
  return IMG_REGEX.test(filename);
};

const getFolders = async (input, blacklists) => {
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
};

const getImages = async (folders) => {
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
              item.isFile() && isImage(item.name)
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
};

const getOutputPath = (file, output) => {
  let output_path = path.join(output, UNCLASSIFIED_FOLDER);
  const regex_info = DATE_REGEX.exec(file);
  DATE_REGEX.test(file);
  if (regex_info) {
    const date = moment(regex_info[0], "YYYYMMDD");
    output_path = path.join(output, date.format("YYYY"), date.format("MM"));
  }
  return output_path;
};

const getBirthTimeAsync = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) reject(err);
      resolve(stats.birthtime);
    });
  });
};

const solveDuplicate = async (newcomer, existing) => {
  const current_birthtime = moment(await getBirthTimeAsync(existing));
  const newcomer_birthtime = moment(await getBirthTimeAsync(newcomer));

  if (current_birthtime.diff(newcomer) !== 0) {
    if (current_birthtime.year() < 2000) {
      return newcomer;
    }

    if (newcomer_birthtime.year() < 2000) {
      return existing;
    }
  }

  console.log(`YOU NEED TO MANUALLY VALIDATE THIS:
		- ${existing}
		- ${newcomer} `);
  return null;
};

const processImages = async (images, output) => {
  for (let img of images) {
    const output_path = getOutputPath(img, output);
    const filename = path.basename(img);
    const destination = path.join(output_path, filename);

    if (!fs.existsSync(output_path)) {
      await new Promise((resolve, reject) => {
        fs.mkdir(output_path, { recursive: true }, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    }

    if (fs.existsSync(destination)) {
      const resolution = await solveDuplicate(img, destination);
      if (!resolution) {
        continue;
      } else if (resolution === destination) {
        await new Promise((resolve, reject) => {
          fs.unlink(img, (err) => {
            if (err) reject(err);
            resolve(true);
          });
        });
        continue;
      }
    }

    await new Promise((resolve, reject) => {
      fs.rename(img, destination, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
};

(async () => {
  const input = args[0] || __dirname;
  const output = args[1] || path.join(__dirname, "output");

  const folder_spinner = ora({
    text: "Getting all folder to process",
    ...spinner_options,
  }).start();

  const folders = await getFolders(input, [output]);

  folder_spinner.succeed("All the folder have been mapped.");

  const images_spinner = ora({
    ...spinner_options,
    text: "Getting all the images to process",
  }).start();
  const images = await getImages(folders);

  images_spinner.succeed("All the images have been mapped.");

  const processing_spinner = ora({
    ...spinner_options,
    text: "Processing images",
  }).start();
  await processImages(images, output);
  processing_spinner.succeed("All images have been processed.");
})();
