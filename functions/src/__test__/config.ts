import * as fs from "fs";

import { TestEnvironmentConfig } from "@firebase/rules-unit-testing";
import * as dotenv from "dotenv";
import { AppOptions } from "firebase-admin/app";

const config = dotenv.config().parsed;

const PROJECT_ID = config!.TEST_PROJECT_ID;

const adminConfig: AppOptions = {
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
};

const emulatorConfig: TestEnvironmentConfig = {
  projectId: PROJECT_ID,
  firestore: {
    rules: fs.readFileSync(`${__dirname}/../../../rules/firestore.rules`, "utf8"),
    host: "localhost",
    port: 8080,
  },
  storage: {
    rules: fs.readFileSync(`${__dirname}/../../../rules/storage.rules`, "utf8"),
    host: "localhost",
    port: 9199,
  },
};

export const testConfig = {
  adminConfig,
  emulatorConfig,
};
