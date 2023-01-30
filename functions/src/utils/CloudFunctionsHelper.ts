import * as functions from "firebase-functions";

/**
 * CloudFunctions で利用する関数
 */
class CloudFunctionsHelper {
  private constructor() {}

  // Todo: ログの出力基準を明記
  /**
   * * debug
   * * log
   * * info
   * * error
   * * warn
   * * write
   */
  static functionsLogger = functions.logger;
}

export const functionsLogger = CloudFunctionsHelper.functionsLogger;
