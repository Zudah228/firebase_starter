import * as fs from "fs";

import * as dotenv from "dotenv";

const config = dotenv.config().parsed;

const PROJECT_ID = config!.TEST_PROJECT_ID;

export const testConfig = {
  emulatorConfig: {
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
  },
};
