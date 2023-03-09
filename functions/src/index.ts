import betterModuleAlias from "better-module-alias";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { TIMEZONE } from "$src/config";

// パスエイリアスの設定
betterModuleAlias(`${__dirname}`, {
  $src: "./",
});

process.env.TZ = TIMEZONE;

initializeApp(functions.config().firebase);

// undefined の値を Firestore に追加しない設定。
getFirestore().settings({
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
