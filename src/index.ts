import ora from 'ora';
import path from 'path';
import { listAllFolders } from './folders/list';
import { listAllMedia } from './media/list';
import { processMedia } from './media/process';

const args = process.argv.slice(2);

const spinner_options = {
  color: 'magenta',
  spinner: 'arc',
};

(async () => {
  const input = args[0] || __dirname;
  const output = args[1] || path.join(__dirname, 'output');
  // this is a new line
  // adding a new line
  // adding a super cool line

  const folder_spinner = ora({
    text: 'Getting all folder to process',
    ...spinner_options,
  } as ora.Options).start();

  const folders = await listAllFolders(input, [output]);
  folder_spinner.succeed(`All the folder(s) have been mapped.`);

  const images_spinner = ora({
    ...spinner_options,
    text: `Getting all images from the ${folders.size} folder(s).`,
  } as ora.Options).start();

  const images = await listAllMedia(folders);

  images_spinner.succeed(
    `All ${images.length} images from the ${folders.size} folders have been mapped`
  );

  const processing_spinner = ora({
    ...spinner_options,
    text: `Processing ${images.length} images.`,
  } as ora.Options).start();
  const duplicates = await processMedia(images, output);
  if (!duplicates.length) {
    processing_spinner.succeed(`${images.length} images have been processed.`);
  } else {
    processing_spinner.warn(
      `All images have been processed, but there are ${duplicates.length} duplicates.\n  Check the log placed in the output folder.`
    );
  }
})();

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
