import { firestore } from "firebase-admin";

import { getAdminFirestoreRepository } from "$src/domain/repositories/admin_firestore/AdminFirestoreRepository";
import { OmitFunction } from "$src/utils/ClassHelper";
import { FirebaseUnitTest } from "$test/index";
import { TestEntity } from "$test/TestEntity";

/**
 * AdminFirestoreRepository 経由で関数の実行 => パッケージの正規の使い方で確認
 * Firestore からのデータの取得には、AdminFirestoreRepository を使用しない
 */
describe("Admin Firestore Repository の読み取りテスト", () => {
  let firebaseUnitTest: FirebaseUnitTest;

  const documentPath = TestEntity.documentPath;

  beforeAll(async () => {
    firebaseUnitTest = await FirebaseUnitTest.setUp();
  });

  afterEach(async () => {
    await firebaseUnitTest.dispose();
  });

  test("プリミティブ型のドキュメント単体読み取り", async () => {
    let data: firestore.DocumentData | undefined;

    const item: OmitFunction<TestEntity> = {
      stringField: "string",
      numberField: 1,
      booleanField: true,
      nullField: null,
    };

    // あらかじめ保存
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      await firestore.doc(documentPath).set(item);
    });

    // Repository 経由で取得
    await firebaseUnitTest.withAdminSdk(async (firestore) => {
      const testEntityRepository = getAdminFirestoreRepository(TestEntity, firestore);

      data = await testEntityRepository.fetchDocument(documentPath);
    });

    expect(data).toBeDefined();
    expect(data!.entity).toEqual(item);
  });

  // Todo: fetchDocumentで、 単体のドキュメントのフェッチのテスト(Map 型)
  // Todo: fetchDocumentで、 単体のドキュメントのフェッチのテスト(Array 型)
  // Todo: fetchDocumentで、 Timestamp 型が Date に変換されているかのテスト
  // Todo: fetchDocumentで、 DocumentReference 型 が正しく取得されているかのテスト
  // Todo: fetchDocumentで、 GeoPoint 型 が正しく取得されているかのテスト
  // Todo: fetchDocumentで、 class 内の Timestamp が Date に変換されているかのテスト
  // Todo: fetchDocumentで、 map 内の Timestamp が Date に変換されているかのテスト
  // Todo: fetchDocumentで、 array 内の Timestamp が Date に変換されているかのテスト
  // Todo: fetchCollection
});
