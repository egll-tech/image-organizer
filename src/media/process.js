import moment from "moment";
import { compare } from "./compare";

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
		const date = getDate(destination)
		const result = compare(date, newcomer, destination);
		switch (result) {
			case (result === newcomer):
				return DUPLICATES_RESULTS.OVERWRITE_EXISTING;
			case (result === destination):
				return DUPLICATES_RESULTS.DELETE_NEWCOMER
			case (!result):
			default:
				return DUPLICATES_RESULTS.UNKNOWN
		}
			

	}
	return DUPLICATES_RESULTS.REGULAR
}

function move(from, to) {
	fs.renameSync(from, to);
}

function rm(file) {
	fs.unlinkSync(file);
}

function getDate(full_path) {
	const day = path.basename(path.resolve(full_path, ".."));
	const month = path.basename(path.resolve(full_path, "..", ".."));
	const year = path.basename(path.resolve(full_path, "..", "..", ".."));

	return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
}

const DUPLICATES_RESULTS = {
	OVERWRITE_EXISTING,
	DELETE_NEWCOMER,
	UNKNOWN,
	REGULAR
}