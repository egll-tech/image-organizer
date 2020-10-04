import constants from './defaults';
import fs from 'fs';
import path from 'path';

export class Logger {
  private static stream: fs.WriteStream | null = null;
  private static isNew = false;
  private static log_path: string = constants.log;

  static start(output = __dirname): void {
    Logger.log_path = path.join(output, constants.log);
    Logger.isNew = fs.existsSync(Logger.log_path);
  }

  static log(...text: string[]): void {
    if (!Logger.stream) {
      Logger.stream = fs.createWriteStream(Logger.log_path, {
        encoding: 'utf-8',
      });
    }

    if (Logger.isNew) {
      Logger.stream.write(JSON.stringify(text));
      Logger.isNew = false;
    } else {
      Logger.stream.write(`\n${JSON.stringify(text)}`);
    }
  }

  static end(): void {
    if (Logger.stream) Logger.stream.end();
  }
}
