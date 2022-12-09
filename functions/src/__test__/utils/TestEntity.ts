import { FirestoreDocumentReference, FirestoreGeo } from "../../domain/repository/admin_firestore/types";
import { OmitFunction } from "../../utils/ClassHelper";

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

  readonly arrayField?: string[];
  readonly mapField?: {
    key1: "value1";
    key2: "value2";
    key3: "value3";
  };

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
  readonly stringField?: string;
  readonly arrayField?: string[];
  readonly mapField?: {
    key1: "value1";
    key2: "value2";
    key3: "value3";
  };
}
