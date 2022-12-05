import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";

import { getAdminFirestore } from "@/config";

initializeApp(functions.config().firebase);

// undefined の値を Firestore に追加しない設定。
getAdminFirestore().settings({
  ignoreUndefinedProperties: true,
});

/**
 * トリガーの種類ごとにプレフィックスをつけて export。
 * Http は、1 つのパスごとに export する。
 *
 * Cloud Functions の region は、./config.ts に設定している。
 */
// export {
//   FirestoreTrigger,
//   AuthTrigger,
//   PubSub
//  } from "./presentation/";
