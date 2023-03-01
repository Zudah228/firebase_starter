/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";

/**
 * CloudFunctions で利用する関数
 */
class FunctionsLogger {
  cloudFunctionsLogger = functions.logger;

  static #instance = new FunctionsLogger();

  static getInstance(): FunctionsLogger {
    return this.#instance;
  }

  debug(...args: any[]) {
    this.cloudFunctionsLogger.debug(args);
  }
  info(...args: any[]) {
    this.cloudFunctionsLogger.debug(args);
  }
  warn(...args: any[]) {
    this.cloudFunctionsLogger.debug(args);
  }
  error(...args: any[]) {
    this.cloudFunctionsLogger.debug(args);
  }
}

export const functionsLogger = FunctionsLogger.getInstance();
