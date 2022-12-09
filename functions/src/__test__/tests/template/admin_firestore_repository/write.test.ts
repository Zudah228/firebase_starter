import { DocumentData } from "firebase-admin/firestore";

import { getAdminFirestoreRepository } from "../../../../domain/repository/admin_firestore/AdminFirestoreRepository";
import { OmitFunction } from "../../../../utils/ClassHelper";
import { FirebaseUnitTest } from "../../../index";
import { TestEntity } from "../../../utils/TestEntity";

// Todo: .add のテスト
// Todo: .updateSomeField のテスト
// Todo: .delete のテスト
// Todo: Map 型のテスト
// Todo: Date <=> Timestamp のテスト
// Todo: DocumentReference 型のテスト
// Todo: GeoPoint 型のテスト
// Todo: 各 FieldValue のテスト
// Todo: フィールド内の class のテスト
// Todo: フィールド内の class の配列のテスト
/**
 * AdminFirestoreRepository 経由で関数の実行 => パッケージの正規の使い方で確認
 */
describe("Admin Firestore Repository の書き込みテスト", () => {
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

    const item: OmitFunction<TestEntity> = {
      stringField: "string",
      numberField: 1,
      booleanField: true,
      nullField: null,
    };

    // Repository の使用
    await firebaseUnitTest.withAdminSdk(async (firestore) => {
      const testEntityRepository = getAdminFirestoreRepository(TestEntity, firestore);
      const entity = new TestEntity(item);

      await testEntityRepository.set(documentPath, entity);
    });

    // 取得して確認
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      const doc = await firestore.doc(documentPath).get();
      data = doc.data();
    });

    expect(data).toBeDefined();
    expect(data).toEqual(item);
  });

  test("配列の保存", async () => {
    let data: DocumentData | undefined;

    const item: OmitFunction<TestEntity> = { arrayField: ["element1", "element2"] };

    // Repository の使用
    await firebaseUnitTest.withAdminSdk(async (firestore) => {
      const testEntityRepository = getAdminFirestoreRepository(TestEntity, firestore);
      const entity = new TestEntity(item);

      await testEntityRepository.set(documentPath, entity);
    });

    // 取得して確認
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      const doc = await firestore.doc(documentPath).get();
      data = doc.data();
    });

    expect(data).toBeDefined();
    expect(data).toEqual(item);
  });
});
