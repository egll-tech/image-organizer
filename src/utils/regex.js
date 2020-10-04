const MEDIA_REGEX = new RegExp(
  /\.(gif|jpe?g|tiff?|png|webp|bmp|jfif|exif|ppm|pgm|pbm|pnm|hdr|heif|img|bpg|drw|ico|mp4|mov)$/gi
);
export function isMedia(filename) {
  return MEDIA_REGEX.test(filename);
}

const SOCIAL_MEDIA_REGEX = new RegExp(/(FB|Snapchat)/gi);
export function isFromSocialMedia(filename) {
  return SOCIAL_MEDIA_REGEX.test(filename);
}

const EIGHT_DIGITS_DATE_REGEX = new RegExp(/\d{8}/g);
const YYYY_MM_DD_DATE_REGEX = new RegExp(/\d{4}[-_]\d{2}[-_]\d{2}/gi);
const BEGINNING_OF_TIME_REGEX = new RegExp(/1970/gi);
export class Date {
  static isEigthDigitsDate(filename) {
    return EIGHT_DIGITS_DATE_REGEX.test(filename);
  }

  static getMatchFromEightDigits(filename) {
    let result = EIGHT_DIGITS_DATE_REGEX.exec(filename);
    if (!result) {
      result = filename
        .split(/[\s\_\-]/gi)
        .find((section) => EIGHT_DIGITS_DATE_REGEX.test(section));
    }
    return result;
  }

  static isDefaultFormatDate(filename) {
    return YYYY_MM_DD_DATE_REGEX.test(filename);
  }

  static getMatchFromDefaultFormatDate(filename) {
    return YYYY_MM_DD_DATE_REGEX.exec(filename);
  }

  static isBeginingOfTime(filename) {
    return BEGINNING_OF_TIME_REGEX.test(filename);
  }
}
