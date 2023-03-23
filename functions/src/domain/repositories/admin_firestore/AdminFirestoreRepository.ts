import { SetOptions } from "@google-cloud/firestore";
import { firestore } from "firebase-admin";
import { DocumentReference, Firestore } from "firebase-admin/firestore";

import {
  FirestoreDocument,
  FirestoreDocumentReference,
  FirestoreQueryDocument,
  FirestoreUpdateType,
  FirestoreWriteType,
  QueryBuilder,
} from "./types";
import { AdminFirestoreRepositoryJsonConverter } from "./utils/AdminFirestoreRepositoryJsonConverter";

/**
 * JavaScript の class と Firestore のデータをやり取りさせるためのクラス。
 * Timestamp を Date に加工したりする。
 *
 * インスタンスを無駄に生成しないように、関数呼び出しの度に path を設定するようにしている。
 * path を class の static に設定するなど、path の変更容易性を担保すること。
 */
export class AdminFirestoreRepository extends AdminFirestoreRepositoryJsonConverter {
  constructor(firestore: Firestore) {
    super();
    this.firestore = firestore;
  }

  private firestore: Firestore;

  // reference

  /**
   * transaction などで使用するために public に設定している。
   * @param documentPath
   * @returns
   */
  public documentReference = (documentPath: string): firestore.DocumentReference => {
    return this.firestore.doc(documentPath);
  };

  /**
   * transaction で使用するために public に設定している。
   * @param collectionPath
   * @returns
   */
  public collectionReference = (collectionPath: string): firestore.CollectionReference => {
    return this.firestore.collection(collectionPath);
  };

  /**
   * transaction で使用するために public に設定している。
   * @param collectionId
   * @returns
   */
  public collectionGroupReference = (collectionId: string): firestore.CollectionGroup => {
    return this.firestore.collectionGroup(collectionId);
  };

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
  public set = async <T = firestore.DocumentData>(
    documentPath: string | DocumentReference,
    item: FirestoreWriteType<T> | FirestoreUpdateType<T>,
    options?: SetOptions
  ): Promise<void> => {
    const ref = typeof documentPath === "string" ? this.documentReference(documentPath) : documentPath;
    await ref.set(this.toFirestore(item), options ?? { merge: true });
  };

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
  public add = async <T = firestore.DocumentData>(
    collectionPath: string,
    item: FirestoreWriteType<T>
  ): Promise<FirestoreDocumentReference> => {
    const ref = await this.firestore.collection(collectionPath).add(this.toFirestore(item));
    return ref;
  };

  /**
   * update で一部のフィールドのみを更新。
   *
   * 内部的に toJson が行われ、
   * getter やその他関数は除外される。FieldValue の使用が可能。
   * @param documentPath
   * @param item
   */
  public updateSomeField = async <T = firestore.DocumentData>(
    documentPath: string | DocumentReference,
    item: FirestoreUpdateType<T>
  ): Promise<void> => {
    const ref = typeof documentPath === "string" ? this.documentReference(documentPath) : documentPath;
    await ref.update(this.toFirestore(item));
  };

  /**
   * ドキュメントの消去
   * @param documentPath
   */
  public delete = async (documentPath: string | DocumentReference): Promise<void> => {
    const ref = typeof documentPath === "string" ? this.documentReference(documentPath) : documentPath;
    await ref.delete();
  };

  // read

  /**
   * Timestamp は Date に変換される。
   * @param documentPath
   * @returns
   */
  public fetchDocument = async <T = firestore.DocumentData>(
    documentPath: string | DocumentReference
  ): Promise<FirestoreDocument<T>> => {
    const ref = typeof documentPath === "string" ? this.documentReference(documentPath) : documentPath;
    const snapshot = await ref.get();
    return {
      ref: snapshot.ref,
      exists: snapshot.exists,
      entity: snapshot.exists ? this.fromFirestore(snapshot.data()!) : undefined,
    };
  };

  /**
   * ドキュメントを Read して、存在の有無を確認する。
   *
   * fetchDocument と、取得の処理が変わるわけではない。
   * @param documentPath
   * @returns
   */
  public exists = async (documentPath: string | DocumentReference): Promise<boolean> => {
    const ref = typeof documentPath === "string" ? this.documentReference(documentPath) : documentPath;
    const snapshot = await ref.get();
    return snapshot.exists;
  };

  /**
   *
   * Collection の取得。
   *
   * Timestamp は Date に変換される。
   * @param collectionPath
   * @param queryBuilder
   * @returns
   */
  public fetchCollection = async <T = firestore.DocumentData>(
    collectionPath: string,
    queryBuilder: QueryBuilder
  ): Promise<FirestoreQueryDocument<T>[]> => {
    const snapshot = await queryBuilder(this.collectionReference(collectionPath)).get();

    if (snapshot.docs.length === 0) {
      return [];
    }
    return snapshot.docs.map((snapshot) => {
      return {
        ref: snapshot.ref,
        exists: snapshot.exists,
        entity: this.fromFirestore(snapshot.data()!),
      };
    });
  };

  /**
   * CollectionGroup の取得。
   *
   * Timestamp は Date に変換される。
   * @param collectionId
   * @param queryBuilder
   * @returns
   */
  public fetchCollectionGroup = async <T = firestore.DocumentData>(
    collectionId: string,
    queryBuilder: QueryBuilder
  ): Promise<FirestoreQueryDocument<T>[]> => {
    const snapshot = await queryBuilder(this.collectionGroupReference(collectionId)).get();

    if (snapshot.docs.length === 0) {
      return [];
    }
    return snapshot.docs.map<FirestoreQueryDocument<T>>((snapshot) => {
      return {
        ref: snapshot.ref,
        exists: snapshot.exists,
        entity: this.fromFirestore(snapshot.data()!),
      };
    });
  };

  public bulkWriter = (options?: firestore.BulkWriterOptions): firestore.BulkWriter => {
    return this.firestore.bulkWriter(options);
  };

  /**
   * 指定したドキュメント/コレクション以下の階層の、ドキュメントやサブコレクションを全て削除する。
   *
   * functions で実装する場合、 タイムアウトに気をつけること。
   * @param ref
   * @param bulkWriter: 渡した場合、詳細なエラーを取得することができる。 → bulkWriter.onWriteError
   */
  public recursiveDelete = async (
    ref: string | firestore.DocumentReference | firestore.CollectionReference,
    bulkWriter?: firestore.BulkWriter
  ): Promise<void> => {
    if (typeof ref === "string") {
      const firestoreRef =
        ref.split("/").length % 2 === 0 ? this.documentReference(ref) : this.collectionReference(ref);
      await this.firestore.recursiveDelete(firestoreRef, bulkWriter);
    } else {
      await this.firestore.recursiveDelete(ref, bulkWriter);
    }
  };
}
/**
 * AdminFirestoreRepository のインスタンス生成
 *
 */
export function getAdminFirestoreRepository(firestore: Firestore): AdminFirestoreRepository {
  return new AdminFirestoreRepository(firestore);
}
