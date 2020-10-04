import { getStats } from '../media/stats';
import { isFromSocialMedia, DateRegex } from '../utils/regex';
import path from 'path';
import moment from 'moment';
import { createFolder } from './create';

const unknown_result = 'UNKNOWN';
export async function getDestinationPath(
  filename: string,
  output = path.resolve(__dirname, 'output')
): Promise<string> {
  let result;
  if (!isFromSocialMedia(filename)) {
    result = getFromName(filename);
    if (!result) result = getFromParentFolder(filename);
    if (!result) result = await getFromStats(filename);
  }
  let total_path = path.join(output, unknown_result);
  if (result) {
    total_path = path.join(output, result);
  }
  createFolder(total_path);
  return total_path;
}

function getFromName(filename: string) {
  let result = matchToStructure(DateRegex.getMatchFromEightDigits(filename));

  if (!result) {
    result = matchToStructure(
      DateRegex.getMatchFromDefaultFormatDate(filename),
      'YYYY-MM-DD'
    );
  }
  return result;
}

function getFromParentFolder(filename: string) {
  let result;
  const up2ParentFolder = path.basename(path.resolve(filename, '..', '..'));
  result = matchToStructure(
    DateRegex.getMatchFromDefaultFormatDate(up2ParentFolder),
    'YYYY-MM-DD'
  );

  if (!result) {
    const upParentFolder = path.basename(path.resolve(filename, '..'));
    result = matchToStructure(
      DateRegex.getMatchFromDefaultFormatDate(upParentFolder),
      'YYYY-MM-DD'
    );
  }

  return result;
}

async function getFromStats(filename: string): Promise<string | null> {
  const stats = await getStats(filename);
  const { birthtime, ctime } = stats;
  let result = toStructure(birthtime, '');
  if (!DateRegex.isBeginingOfTime(result)) {
    return result;
  }

  result = toStructure(ctime, '');
  if (!DateRegex.isBeginingOfTime(result)) {
    return result;
  }
  return null;
}

function matchToStructure(
  match: string | null,
  format = 'YYYYMMDD'
): string | null {
  let result = null;
  if (match) {
    result = toStructure(match, format);
  }
  return result;
}

function toStructure(
  match: string | DateRegex,
  format = 'YYYYMMDD'
): string | null {
  const parsed = moment(match, format);
  return parsed.isValid() && parsed.year() > 2000 && parsed.year() <= 2020
    ? path.join(parsed.format('YYYY'), parsed.format('MM'), parsed.format('DD'))
    : null;
}
