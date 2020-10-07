const MEDIA_REGEX = new RegExp(
  /\.(gif|jpe?g|tiff?|png|webp|bmp|jfif|exif|ppm|pgm|pbm|pnm|hdr|heif|img|bpg|drw|ico|mp4|mov)$/gi
);
export function isMedia(filename: string) {
  return MEDIA_REGEX.test(filename);
}

const SOCIAL_MEDIA_REGEX = new RegExp(/(FB|Snapchat|Instasize)/gi);
export function isFromSocialMedia(filename: string) {
  return SOCIAL_MEDIA_REGEX.test(filename);
}

const EIGHT_DIGITS_DATE_REGEX = new RegExp(/\d{8}/g);
const YYYY_MM_DD_DATE_REGEX = new RegExp(/\d{4}[-_]\d{2}[-_]\d{2}/gi);
const BEGINNING_OF_TIME_REGEX = new RegExp(/1970/gi);
export class DateRegex {
  static isEigthDigitsDate(filename: string): boolean {
    return EIGHT_DIGITS_DATE_REGEX.test(filename);
  }

  static getMatchFromEightDigits(filename: string): string | null {
    let result: string | null =
      EIGHT_DIGITS_DATE_REGEX.exec(filename)?.[0] || null;
    if (!result) {
      result =
        filename
          .split(/[\s_-]/gi)
          .find(section => EIGHT_DIGITS_DATE_REGEX.test(section)) || null;
    }
    return result;
  }

  static isDefaultFormatDate(filename: string): boolean {
    return YYYY_MM_DD_DATE_REGEX.test(filename);
  }

  static getMatchFromDefaultFormatDate(filename: string): string | null {
    return YYYY_MM_DD_DATE_REGEX.exec(filename)?.[0] || null;
  }

  static isBeginingOfTime(filename: string | null): boolean {
    if (filename) return BEGINNING_OF_TIME_REGEX.test(filename);
    return true;
  }
}
