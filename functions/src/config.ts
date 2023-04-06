import * as functions from "firebase-functions";

const CLOUD_FUNCTIONS_REGION = "asia-northeast1";
const enforceAppCheck = true;

export const TIMEZONE = "Asia/Tokyo";
export const SCHEDULER_TIMEZONE = "Asia/Tokyo";

export const endpoint = functions.region(CLOUD_FUNCTIONS_REGION).runWith({ enforceAppCheck });

export const whiteList = ["http://localhost"];
// type EnvValues<T> = {
//   dev: T;
//   stg: T;
//   prod: T;
// };

// function envMatch<T>({ dev, stg, prod }: EnvValues<T>): T {
//   const PROJECT_ID = FunctionsConfig.CURRENT_FIREBASE_CONFIG.projectId;
//   if (PROJECT_ID === "") return dev;
//   if (PROJECT_ID === "") return stg;
//   if (PROJECT_ID === "") return prod;
//   throw new Error("Unknown environment");
// }
