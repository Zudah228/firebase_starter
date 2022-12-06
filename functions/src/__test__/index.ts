import * as fs from "fs";

import {
  assertFails,
  initializeTestEnvironment,
  RulesTestEnvironment,
  TokenOptions,
} from "@firebase/rules-unit-testing";

const projectId = "";

/**
 * Firebase の unit テストを行うための class
 */
export class FirebaseUnitTest {
  constructor(testEnv: RulesTestEnvironment) {
    this.testEnv = testEnv;
  }

  testEnv: RulesTestEnvironment;

  /**
   * ルール適応外のテストは、コールバック内でしか行うことができない
   *
   * > When using withSecurityRulesDisabled,
   * > make sure to perform all operations on the context within the callback function and return a Promise
   * > that resolves when the operations are done.
   */
  public withSecurityRulesDisabled() {
    return this.testEnv.withSecurityRulesDisabled;
  }

  public get unauthenticatedUser() {
    return this.testEnv.unauthenticatedContext();
  }

  public getAuthenticatedUser(uid: string, tokenOptions?: TokenOptions | undefined) {
    return this.testEnv.authenticatedContext(uid, tokenOptions);
  }

  public fail(pr: Promise<unknown>) {
    return assertFails(pr);
  }

  /**
   * 非同期でコンストラクタに必要な値を取得
   * @returns {Promise<FirebaseUnitTest>}
   */
  static async setUp(): Promise<FirebaseUnitTest> {
    // セキュリティルールの読み込み
    const testEnv = await initializeTestEnvironment({
      projectId,
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
    });

    return new FirebaseUnitTest(testEnv);
  }

  async dispose(): Promise<void> {
    await this.testEnv.clearFirestore();
    await this.testEnv.clearStorage();
  }
}
