import { firestore } from "firebase-admin";

import { getAdminFirestoreRepository } from "../../../domain/repository/admin_firestore/AdminFirestoreRepository";
import {
  FirestoreDocumentReference,
  FirestoreGeo,
  FirestoreWriteType,
} from "../../../domain/repository/admin_firestore/types";
import { OmitFunction } from "../../../utils/ClassHelper";

/**
 * テスト用の Entity クラス
 */
export class TestEntity {
  constructor(props: OmitFunction<TestEntity>) {
    Object.assign(this, props);
  }
  readonly stringField?: string;
  readonly numberField?: number;
  readonly booleanField?: boolean;
  readonly nullField?: null;

  readonly arrayField?: (string | undefined)[];
  readonly anotherArrayField?: (number | undefined)[];
  readonly mapField?: TestMapField;

  readonly dateField?: Date;

  readonly geoField?: FirestoreGeo;
  readonly documentRefField?: FirestoreDocumentReference;

  readonly classField?: TestNestedClass;
  readonly classArrayField?: TestNestedClass[];

  static documentPath = "test/doc";

  getFunction(_: unknown): string {
    return "function";
  }
}

/**
 * TestEntity のフィールドに含まれるクラス
 */
export class TestNestedClass {
  constructor(props: OmitFunction<TestNestedClass>) {
    Object.assign(this, props);
  }
  readonly stringField?: string;
  readonly arrayField?: (string | undefined)[];
  readonly mapField?: {
    key1: string;
    key2: string;
    key3?: string | undefined;
  };
  getFunction(_: unknown): string {
    return "function";
  }
}

export type TestMapField = {
  key1: string;
  key2: string;
};

// Firestore
export type FirestoreTestEntityWriteType = FirestoreWriteType<
  Omit<TestEntity, "mapField"> & {
    mapField?: FirestoreWriteType<TestMapField>;
  }
>;

export const getTestEntityFirestoreRepository = (firestore: firestore.Firestore) =>
  getAdminFirestoreRepository<TestEntity, FirestoreTestEntityWriteType>(TestEntity, firestore);
