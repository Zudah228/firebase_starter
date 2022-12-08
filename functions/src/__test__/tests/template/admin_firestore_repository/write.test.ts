import { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestoreRepository } from "../../../../domain/repository/admin_firestore/AdminFirestoreRepository";
import { Fields } from "../../../../utils/ClassHelper";
import { FirebaseUnitTest } from "../../../index";
import { TestEntity } from "../../../utils/TestEntity";

/**
 * AdminFirestoreRepository 経由で関数の実行 => パッケージの正規の使い方で確認
 */
describe("Admin Firestore Repository のテスト", () => {
  let firebaseUnitTest: FirebaseUnitTest;

  const documentPath = TestEntity.documentPath;

  beforeAll(async () => {
    firebaseUnitTest = await FirebaseUnitTest.setUp();
  });

  afterEach(async () => {
    await firebaseUnitTest.dispose();
  });

  test("プリミティブ型の保存", async () => {
    let data: DocumentData | undefined;

    const item: Fields<TestEntity> = {
      stringField: "string",
      numberField: 1,
      booleanField: true,
      nullField: null,
    };

    await firebaseUnitTest.withAdminSdk(async (firestore) => {
      const testEntityRepository = getAdminFirestoreRepository(TestEntity, firestore);
      const entity = new TestEntity(item);

      await testEntityRepository.set(documentPath, entity);

      const doc = await firestore.doc(documentPath).get();
      data = doc.data();
      return;
    });
    expect(data).toBeDefined();
    expect(data).toEqual(item);
  });

  test("配列の保存", async () => {
    let data: DocumentData | undefined;

    const item: Fields<TestEntity> = { arrayField: ["element1", "element2"] };

    await firebaseUnitTest.withAdminSdk(async (firestore) => {
      const testEntityRepository = getAdminFirestoreRepository(TestEntity, firestore);
      const entity = new TestEntity(item);

      await testEntityRepository.set(documentPath, entity);

      const doc = await firestore!.doc(documentPath).get();
      data = doc.data();
      return;
    });
    expect(data).toBeDefined();
    expect(data).toEqual(item);
  });
});
