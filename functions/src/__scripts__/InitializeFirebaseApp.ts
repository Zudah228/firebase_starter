import * as admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { scriptConfig } from "./config";

/**
 * Cloud Functions ではなく、ローカルで実行するスクリプト。
 * firebase-admin の初期化。
 */
export function initialize(): void {
  const { PROJECT_ID, DATABASE_URL, STORAGE_BUCKET } = scriptConfig;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(`./service_account_keys/${PROJECT_ID}.json`);

  const app = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
  });

  console.info(`FirebaseProject: ${PROJECT_ID}`, app.options.projectId);

  // undefined の値を Firestore に追加しない設定。
  getFirestore().settings({
    ignoreUndefinedProperties: true,
  });
}
