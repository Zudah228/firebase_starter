import { DocumentData } from "firebase-admin/firestore";

import { getFirestoreRepository } from "../../../../../domain/repository/admin_firestore/AdminFirestoreRepository";
import { Fields } from "../../../../../utils/ClassHelper";
import { FirebaseUnitTest } from "../../../../index";

/** */
class TestEntity {
  constructor(props: Fields<TestEntity>) {
    Object.assign(this, props);
  }
  stringField!: string;
  numberField!: number;
  booleanField!: boolean;
}

jest.setTimeout(20000);
/**
 * AdminFirestoreRepository 経由で関数の実行 => パッケージの正規の使い方で確認
 */
describe("AdminFirestoreRepository のテスト", () => {
  let firebaseUnitTest: FirebaseUnitTest;
  const testDocumentPath = "test/doc";

  beforeAll(async () => {
    firebaseUnitTest = await FirebaseUnitTest.setUp();
  });

  afterEach(async () => {
    await Promise.all([firebaseUnitTest.testEnv.clearFirestore()]);
  });

  test("プリミティブ型の保存", async () => {
    let data: DocumentData | undefined;

    const item = { stringField: "string", numberField: 1, booleanField: true };

    await firebaseUnitTest.testEnv.withSecurityRulesDisabled(async (context) => {
      const firestore = context.firestore();
      const testEntityRepository = getFirestoreRepository(TestEntity, firestore);
      const entity = new TestEntity(item);

      await testEntityRepository.set(testDocumentPath, entity);

      const doc = await firestore.doc(testDocumentPath).get();
      data = doc.data();
      return;
    });
    expect(data).toBeDefined();
    expect(data).toEqual(item);
  });
});
