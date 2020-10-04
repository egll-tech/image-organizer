const { getStats } = require("../media/stats");
const { isFromSocialMedia, Date } = require("../utils/regex");
const path = require("path");

const unknown_result = "UNKNOWN";
export async function getDestinationPath(
  filename,
  output = path.resolve(__dirname, "output")
) {
  let result;
  if (!isFromSocialMedia(filename)) {
    result = getFromName(filename);
    if (!result) result = getFromParentFolder(filename);
    if (!result) result = await getFromStats(filename);

    if (result) return path.join(output, result);
  }
  return path.join(output, unknown_result);
}

function getFromName(filename) {
  let result = matchToStructure(Date.getMatchFromEightDigits(filename));

  if (!result) {
    result = matchToStructure(
      Date.getMatchFromDefaultFormatDate(filename),
      "YYYY-MM-DD"
    );
  }
  return result;
}

function getFromParentFolder(filename) {
  let result;
  const up2ParentFolder = path.basename(path.resolve(filename, "..", ".."));
  result = matchToStructure(
    Date.getMatchFromDefaultFormatDate(up2ParentFolder),
    "YYYY-MM-DD"
  );

  if (!result) {
    const upParentFolder = path.basename(path.resolve(filename, ".."));
    result = matchToStructure(
      Date.getMatchFromDefaultFormatDate(upParentFolder),
      "YYYY-MM-DD"
    );
  }

  return result;
}

async function getFromStats(filename) {
  const stats = await getStats(filename);
  const { birthtime, ctime } = stats;
  let result = toStructure(birthtime, "");
  if (!Date.isBeginingOfTime(result)) {
    return result;
  }

  result = toStructure(ctime, "");
  if (!Date.isBeginingOfTime(result)) {
    return result;
  }
  return null;
}

function matchToStructure(match, format = "YYYYMMDD") {
  let result;
  if (match) {
    result = toStructure(match[0], format);
  }
  return result;
}

function toStructure(match, format = "YYYYMMDD") {
  const parsed = moment(match, format);
  return parsed.isValid() && parsed.year() > 2000
    ? path.join(parsed.year(), parsed.format("MM"), parsed.format("DD"))
    : null;
}
