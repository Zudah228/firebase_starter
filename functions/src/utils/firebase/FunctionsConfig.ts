export namespace FunctionsConfig {
  /**
   * Firebase Functions にデフォルトで設定されている、環境変数
   *
  // https://firebase.google.com/docs/functions/config-env?hl=ja#automatically_populated_environment_variables
   */
  export const CURRENT_FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG!) as {
    databaseURL: string;
    storageBucket: string;
    projectId: string;
  };
}
