import * as functions from "firebase-functions";

export function functionsHttpsError(code: functions.https.FunctionsErrorCode, message: string, details?: unknown) {
  return new functions.https.HttpsError(code, message, details);
}

// Todo: ログの出力基準を明記
/**
 * * debug
 * * log
 * * info
 * * error
 * * warn
 * * write
 */
export const functionsLogger = functions.logger;
