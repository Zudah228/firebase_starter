import { SetOptions } from "@google-cloud/firestore";
import { ClassConstructor } from "class-transformer";
import { firestore } from "firebase-admin";
import { DocumentReference, Firestore } from "firebase-admin/firestore";

import { FirestoreDocument, FirestoreDocumentReference, FirestoreWriteType, QueryBuilder } from "./types";
import { AdminFirestoreRepositoryJsonConverter } from "./utils/AdminFirestoreRepositoryJsonConverter";

/**
 * JavaScript の class と Firestore のデータをやり取りさせるためのクラス。
 * Timestamp を Date に加工したりする。
 *
 * インスタンスを無駄に生成しないように、関数呼び出しの度に path を設定するようにしている。
 * path を class の static に設定するなど、path の変更容易性を担保すること。
 */
export class AdminFirestoreRepository<
  T,
  WriteType extends firestore.DocumentData = FirestoreWriteType<T>
> extends AdminFirestoreRepositoryJsonConverter<T> {
  constructor(entityConstructor: ClassConstructor<T>, firestore: Firestore) {
    super(entityConstructor);
    this.firestore = firestore;
  }

  private firestore: Firestore;

  // reference

  /**
   * transaction などで使用するために public に設定している。
   * @param documentPath
   * @returns
   */
  public getDocumentReference(documentPath: string): firestore.DocumentReference {
    return this.firestore.doc(documentPath);
  }

  /**
   * transaction で使用するために public に設定している。
   * @param collectionPath
   * @returns
   */
  public getCollectionReference(collectionPath: string) {
    return this.firestore.collection(collectionPath);
  }

  /**
   * transaction で使用するために public に設定している。
   * @param collectionId
   * @returns
   */
  public getCollectionGroupReference(collectionId: string) {
    return this.firestore.collectionGroup(collectionId);
  }

  // write

  /**
   * set でドキュメントを指定して保存。
   *
   * 一部フィールドの更新に関しては、updateSomeField の使用を推奨。
   *
   * 内部的に toJson が行われ、
   * getter やその他関数は除外される。FieldValue の使用が可能。
   * @param documentPath
   * @param item
   * @param options
   */
  public async set(documentPath: string | DocumentReference, item: WriteType, options?: SetOptions): Promise<void> {
    const ref = typeof documentPath === "string" ? this.getDocumentReference(documentPath) : documentPath;
    await ref.set(this.toJson(item), options ?? { merge: true });
  }

  /**
   * add で自動生成のドキュメントを作成。
   *
   * バックグラウンド関数では、冪等性が担保されないため、あまり推奨しない。
   *
   * 内部的に toJson が行われ、
   * getter やその他関数は除外される。FieldValue の使用が可能。
   * @param collectionPath
   * @param item
   * @returns {string} - 自動生成した id を含んだ DocumentReference
   */
  public async add(collectionPath: string, item: WriteType): Promise<FirestoreDocumentReference> {
    const ref = await this.firestore.collection(collectionPath).add(this.toJson(item));
    return ref;
  }

  /**
   * update で一部のフィールドのみを更新。
   *
   * 内部的に toJson が行われ、
   * getter やその他関数は除外される。FieldValue の使用が可能。
   * @param documentPath
   * @param item
   */
  public async updateSomeField(documentPath: string | DocumentReference, item: Partial<WriteType>): Promise<void> {
    const ref = typeof documentPath === "string" ? this.getDocumentReference(documentPath) : documentPath;
    await ref.update(this.toJson(item));
  }

  /**
   * ドキュメントの消去
   * @param documentPath
   */
  public async delete(documentPath: string | DocumentReference): Promise<void> {
    const ref = typeof documentPath === "string" ? this.getDocumentReference(documentPath) : documentPath;
    await ref.delete();
  }

  // read

  /**
   * Timestamp は Date に変換される。
   * @param documentPath
   * @returns
   */
  public async fetchDocument(documentPath: string | DocumentReference): Promise<FirestoreDocument<T> | undefined> {
    const ref = typeof documentPath === "string" ? this.getDocumentReference(documentPath) : documentPath;
    const snapshot = await ref.get();
    return this.fromSnapshot(snapshot);
  }

  /**
   * ドキュメントを Read して、存在の有無を確認する。
   *
   * fetchDocument と、取得の処理が変わるわけではない。
   * @param documentPath
   * @returns
   */
  public async exists(documentPath: string | DocumentReference): Promise<boolean> {
    const ref = typeof documentPath === "string" ? this.getDocumentReference(documentPath) : documentPath;
    const snapshot = await ref.get();
    return snapshot.exists;
  }

  /**
   *
   * Collection の取得。
   *
   * Timestamp は Date に変換される。
   * @param collectionPath
   * @param queryBuilder
   * @returns
   */
  public async fetchCollection(collectionPath: string, queryBuilder: QueryBuilder): Promise<FirestoreDocument<T>[]> {
    const snapshot = await queryBuilder(this.getCollectionReference(collectionPath)).get();

    if (snapshot.docs.length === 0) {
      return [];
    }
    return snapshot.docs.map((snapshot) => {
      return this.fromSnapshot(snapshot);
    });
  }

  /**
   * CollectionGroup の取得。
   *
   * Timestamp は Date に変換される。
   * @param collectionId
   * @param queryBuilder
   * @returns
   */
  public async fetchCollectionGroup(collectionId: string, queryBuilder: QueryBuilder): Promise<FirestoreDocument<T>[]> {
    const snapshot = await queryBuilder(this.getCollectionGroupReference(collectionId)).get();

    if (snapshot.docs.length === 0) {
      return [];
    }
    return snapshot.docs.map((snapshot) => {
      return this.fromSnapshot(snapshot);
    });
  }
}
/**
 * クラスごとの AdminFirestoreRepository のインスタンス生成
 *
 * ### Type Param
 * * T - やりとりする class 。
 * * WriteType - デフォルトは FirestoreWriteType<T>。map を含むフィールドの場合、渡す必要がある。
 *    * ex.)
 *    *     type EntityWriteType = FirestoreWriteType<Omit<Entity, "mapField">> &
 *    *       { mapField?: FirestoreWriteType<MapField> };
 *
 * @param entityConstructor
 * @returns
 */
export function getAdminFirestoreRepository<T, WriteType extends firestore.DocumentData = FirestoreWriteType<T>>(
  entityConstructor: ClassConstructor<T>,
  firestore: Firestore
): AdminFirestoreRepository<T, WriteType> {
  return new AdminFirestoreRepository<T, WriteType>(entityConstructor, firestore);
}
