import moment from 'moment';

import { getDestinationPath } from '../folders/destination';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';
import { compare } from './compare';

export async function processMedia(
  media_list: string[],
  output: string
): Promise<string[]> {
  const duplicates = new Array();
  Logger.start(output);

  for (let media of media_list) {
    const destination = await getDestination(media, output);
    switch (await processDuplicates(media, destination)) {
      case DUPLICATES_RESULTS.OVERWRITE_EXISTING:
      case DUPLICATES_RESULTS.REGULAR:
        move(media, destination);
        break;
      case DUPLICATES_RESULTS.DELETE_NEWCOMER:
        rm(media);
        break;
      case DUPLICATES_RESULTS.UNKNOWN:
      default:
        duplicates.push(media);
        Logger.log(JSON.stringify({ file: media, destination: destination }));
        break;
    }
  }
  Logger.end();
  return duplicates;
}

async function getDestination(media: string, output: string) {
  const destination_path = await getDestinationPath(media, output);
  const filename = path.basename(media);
  return path.join(destination_path, filename);
}

async function processDuplicates(
  newcomer: string,
  destination: string
): Promise<DUPLICATES_RESULTS> {
  if (fs.existsSync(destination)) {
    const date = getDate(destination);
    const result = await compare(date, newcomer, destination);

    if (result === newcomer) {
      return DUPLICATES_RESULTS.OVERWRITE_EXISTING;
    } else if (result === destination) {
      return DUPLICATES_RESULTS.DELETE_NEWCOMER;
    } else {
      return DUPLICATES_RESULTS.UNKNOWN;
    }
  }
  return DUPLICATES_RESULTS.REGULAR;
}

function move(from: string, to: string): void {
  fs.renameSync(from, to);
}

function rm(file: string): void {
  fs.unlinkSync(file);
}

function getDate(full_path: string): moment.Moment {
  const day = path.basename(path.resolve(full_path, '..'));
  const month = path.basename(path.resolve(full_path, '..', '..'));
  const year = path.basename(path.resolve(full_path, '..', '..', '..'));

  return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
}

enum DUPLICATES_RESULTS {
  OVERWRITE_EXISTING,
  DELETE_NEWCOMER,
  UNKNOWN,
  REGULAR,
}
