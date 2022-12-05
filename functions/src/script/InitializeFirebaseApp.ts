/* eslint-disable no-console */
import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

import { getAdminFirestore } from "@/config";

/**
 * Cloud Functions ではなく、ローカルで実行するスクリプト。
 * firebase-admin の初期化。
 */
export function initialize(): void {
  // TODO: DB URL の設定
  const dbUrl = "";
  // TODO: Storage Bucket の設定
  const storageBucket = "";
  // TODO: サービスアカウントキーの設定
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require("../../keys/");

  const app = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: dbUrl,
    storageBucket: storageBucket,
  });

  console.log("FirebaseProject:", app.options.projectId);

  getAdminFirestore().settings({
    ignoreUndefinedProperties: true,
  });
}
