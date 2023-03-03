import { GeoPoint } from "firebase-admin/firestore";

import { FirestoreDocument, FirestoreWriteType } from "$src/domain/repositories/admin_firestore/types";
import { OmitFunction } from "$src/utils/TypeHelper";
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
    let data: FirestoreDocument<TestEntity>;

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
    await firebaseUnitTest.withAdminSdk(async (firestoreRepository) => {
      data = await firestoreRepository.fetchDocument<TestEntity>(documentPath);
    });

    expect(data!.exists).toBe(true);
    expect(data!.entity).toBeDefined();
    expect(data!.entity).toMatchObject(item);
  });

  test("Timestamp のドキュメント単体読み取り", async () => {
    let data: FirestoreDocument<TestEntity>;
    const date = new Date();

    const item: OmitFunction<TestEntity> = {
      dateField: date,
    };

    // あらかじめ保存
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      await firestore.doc(documentPath).set(item);
    });

    // Repository 経由で取得
    await firebaseUnitTest.withAdminSdk(async (firestoreRepository) => {
      data = await firestoreRepository.fetchDocument<TestEntity>(documentPath);
    });

    expect(data!.exists).toBe(true);
    expect(data!.entity).toMatchObject(item);
    expect(data!.entity?.dateField?.valueOf()).toBe(date.valueOf());
  });

  test("GeoPoint のドキュメント単体読み取り", async () => {
    let data: FirestoreDocument<TestEntity>;
    const geoToSave = firebaseUnitTest.generateClientSdkGeoPoint(35, 135);
    const geoToCompare = new GeoPoint(geoToSave.latitude, geoToSave.longitude);

    const item: FirestoreWriteType<TestEntity> = {
      geoField: geoToSave,
    };

    // あらかじめ保存
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      await firestore.doc(documentPath).set(item);
    });

    // Repository 経由で取得
    await firebaseUnitTest.withAdminSdk(async (firestoreRepository) => {
      data = await firestoreRepository.fetchDocument<TestEntity>(documentPath);
    });

    expect(data!.exists).toBe(true);
    expect(data!.entity).toBeDefined();
    expect(data!.entity?.geoField).toMatchObject(geoToCompare);
  });

  test("DocumentReference のドキュメント単体読み取り", async () => {
    let data: FirestoreDocument<TestEntity>;
    let pathToCompare: string;
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      pathToCompare = (await firestore.collection("test").add({})).path;
    });

    // あらかじめ保存
    await firebaseUnitTest.withSecurityRulesDisabled(async (firestore) => {
      const item: Partial<{ [P in keyof TestEntity]: unknown }> = {
        documentRefField: firestore.doc(pathToCompare),
      };
      await firestore.doc(documentPath).set(item);
    });

    // Repository 経由で取得
    await firebaseUnitTest.withAdminSdk(async (firestoreRepository) => {
      data = await firestoreRepository.fetchDocument<TestEntity>(documentPath);
    });

    expect(data!.exists).toBe(true);
    expect(data!.entity).toBeDefined();
    expect(data!.entity?.documentRefField?.path).toEqual(pathToCompare!);
  });

  // Todo: fetchDocumentで、 単体のドキュメントのフェッチのテスト(Map 型)
  // Todo: fetchDocumentで、 単体のドキュメントのフェッチのテスト(Array 型)
  // Todo: fetchDocumentで、 DocumentReference 型 が正しく取得されているかのテスト
  // Todo: fetchDocumentで、 GeoPoint 型 が正しく取得されているかのテスト
  // Todo: fetchDocumentで、 map 内の Timestamp が Date に変換されているかのテスト
  // Todo: fetchDocumentで、 array 内の Timestamp が Date に変換されているかのテスト
  // Todo: fetchCollection
});
