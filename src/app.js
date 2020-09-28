const ora = require("ora");
const path = require("path");
const { listAllFolders } = require("./folders/list");
const { listAllMedia } = require("./media/list");
const { processMedia } = require("./media/process");

const args = process.argv.slice(2);

const spinner_options = {
  color: "magenta",
  spinner: "arc",
};

(async () => {
  const input = args[0] || __dirname;
  const output = args[1] || path.join(__dirname, "output");

  const folder_spinner = ora({
    text: "Getting all folder to process",
    ...spinner_options,
  }).start();

  const folders = await listAllFolders(input, [output]);
  folder_spinner.succeed("All the folder have been mapped.");

  const images_spinner = ora({
    ...spinner_options,
    text: `Getting all images from the ${folders.size} folder(s).`,
  }).start();

  const images = await listAllMedia(folders);

  images_spinner.succeed(
    `All ${images.length} images from the ${folders.size} folders have been mapped`
  );

  const processing_spinner = ora({
    ...spinner_options,
    text: `Processing ${images.length} images.`,
  }).start();
  const duplicates = await processMedia(images, output);
  if (!duplicates.length) {
    processing_spinner.succeed(`${images.length} images have been processed.`);
  } else {
    processing_spinner.warn(
      `All images have been processed, but there are ${duplicates.length} duplicates.\n  Check the log placed in the output folder.`
    );
  }
})();
