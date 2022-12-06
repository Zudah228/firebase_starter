import {
  assertFails,
  initializeTestEnvironment,
  RulesTestEnvironment,
  TokenOptions,
} from "@firebase/rules-unit-testing";

import { testConfig } from "./config";

/**
 * Firebase の unit テストを行うための class
 */
export class FirebaseUnitTest {
  constructor(testEnv: RulesTestEnvironment) {
    this.#testEnv = testEnv;
  }

  #testEnv: RulesTestEnvironment;

  /**
   * ルール適応外のテストは、コールバック内でしか行うことができない
   *
   * > When using withSecurityRulesDisabled,
   * > make sure to perform all operations on the context within the callback function and return a Promise
   * > that resolves when the operations are done.
   */
  public get testEnv() {
    return this.#testEnv;
  }

  public get unauthenticatedUser() {
    return this.#testEnv.unauthenticatedContext();
  }

  public getAuthenticatedUser(uid: string, tokenOptions?: TokenOptions | undefined) {
    return this.#testEnv.authenticatedContext(uid, tokenOptions);
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
    const testEnv = await initializeTestEnvironment(testConfig.emulatorConfig);

    return new FirebaseUnitTest(testEnv);
  }

  async dispose(): Promise<void> {
    await this.#testEnv.clearFirestore();
    await this.#testEnv.clearStorage();
  }
}
