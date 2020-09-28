const { getDestinationPath } = require( "../folders/destination");
const { Logger } = require("../utils/logger");
const path = require("path");
const fs = require("fs");

export function processMedia(media_list, output) {
  const duplicates = new Array();
  Logger.start(output);

  for (let media of media_list) {
		const destination = getDestination(media, output);
		switch(processDuplicates(media, destination)) {
			case OVERWRITE_EXISTING:
			case REGULAR:
				move(media, destination);
				break;
			case DELETE_NEWCOMER:
				rm(media);
				break;
			case UNKNOWN:
			default:
				duplicates.push(media);
				Logger.log({file: media, destination: destination});
				break;
		}
	
  }
	Logger.end();
	return duplicates;
}

function getDestination(media, output) {
	const destination_path = await getDestinationPath(media, output);
	const filename = path.basename(media);
	return path.join(destination_path, filename);
}

function processDuplicates(newcomer, destination) {
	if (fs.existsSync(destination)) {
		return DUPLICATES_RESULTS.UNKNOWN
	}
	return DUPLICATES_RESULTS.REGULAR
}

function move(from, to) {
	fs.renameSync(from, to);
}

function rm(file) {
	fs.unlinkSync(file);
}

const DUPLICATES_RESULTS = {
	OVERWRITE_EXISTING,
	DELETE_NEWCOMER,
	UNKNOWN,
	REGULAR
}