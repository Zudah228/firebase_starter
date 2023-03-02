import { firestore } from "firebase-admin";

import { FirestoreDocument, FirestoreQueryDocument } from "../types";
import { isDocumentReference, isGeoPoint, isObject, isTimestamp } from "./TypeGuards";

/**
 * Firestore と JS の class を上手くデータのやり取りをさせるための class
 *
 * toFirestore と fromFirestore を提供する
 */
export class AdminFirestoreRepositoryJsonConverter {
  /**
   * transaction で使用するために public に設定している。
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toFirestore = (item: any): Record<string, unknown> => {
    const objectGetters = this.extractAllGetters(item);

    const serializableObj = { ...item, ...objectGetters };

    Object.entries(serializableObj).forEach(([propertyKey, _]) => {
      const value = serializableObj[propertyKey];

      // undefined: 削除
      if (value === undefined) {
        delete serializableObj[propertyKey];
      }
      // 配列: 各要素に this.toJson() + undefined の削除
      else if (Array.isArray(value)) {
        serializableObj[propertyKey] = value
          .map((e: unknown) => {
            if (isObject(e)) {
              return this.toFirestore(e);
            }
            return e;
          })
          .filter((e) => e !== undefined);
      } else if (
        value instanceof Date ||
        value instanceof firestore.DocumentReference ||
        value instanceof firestore.GeoPoint ||
        value instanceof firestore.FieldValue
      ) {
        // skip
      }
      // object: this.toJson() の実行
      else if (isObject(value)) {
        serializableObj[propertyKey] = this.toFirestore(serializableObj[propertyKey] as Record<string, unknown>);
      }
    });
    return serializableObj;
  };

  /**
   * transaction 、バックグラウンド関数で取得した snapshot を加工するために、public にしている。
   */
  public fromFirestore = <T>(data: firestore.DocumentData): T => {
    return this.encodeFirestoreTypes(data) as T;
  };

  protected fromSnapshot<T>(snapshot: firestore.QueryDocumentSnapshot): FirestoreQueryDocument<T>;
  protected fromSnapshot<T>(snapshot: firestore.DocumentSnapshot): FirestoreDocument<T>;
  protected fromSnapshot<T>(
    snapshot: firestore.QueryDocumentSnapshot | firestore.DocumentSnapshot
  ): FirestoreDocument<T> | FirestoreQueryDocument<T> {
    if (snapshot instanceof firestore.QueryDocumentSnapshot) {
      return {
        ref: snapshot.ref,
        entity: this.fromFirestore<T>(snapshot.data()!),
      };
    }
    return {
      ref: snapshot.ref,
      entity: snapshot.exists ? this.fromFirestore<T>(snapshot.data()!) : undefined,
      exists: snapshot.exists,
    };
  }

  /**
   * Firestore 独自の型を、JavaScript の型に変換
   *
   * firestore.DocumentReference、firestore.GeoPoint はそのまま
   *
   * @param obj param
   * @returns
   */
  private encodeFirestoreTypes = (obj: Record<string, unknown>) => {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (!obj[key]) return;
      if (isTimestamp(val)) {
        obj[key] = val.toDate();
      } else if (isGeoPoint(val)) {
        obj[key] = val;
      } else if (isDocumentReference(val)) {
        obj[key] = val;
      } else if (isObject(val)) {
        obj[key] = this.encodeFirestoreTypes(val);
      }
    });
    return obj;
  };

  /**
   * ゲッターや関数を取り除く
   *
   * @param obj param
   * @returns
   */
  private extractAllGetters = (obj: Record<string, unknown>) => {
    const prototype = Object.getPrototypeOf(obj);
    const fromInstanceObj = Object.keys(obj);
    const fromInstance = Object.getOwnPropertyNames(obj);
    const fromPrototype = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

    const keys = [...fromInstanceObj, ...fromInstance, ...fromPrototype];

    const getters = keys
      .map((key) => Object.getOwnPropertyDescriptor(prototype, key))
      .map((descriptor, index) => {
        // FieldValue は残す
        if (descriptor instanceof firestore.FieldValue) {
          return keys[index];
        }
        if (descriptor && typeof descriptor.get === "function") {
          return keys[index];
        } else {
          return undefined;
        }
      })
      .filter((d) => d !== undefined);

    return getters.reduce<Record<string, unknown>>((accumulator, currentValue) => {
      if (typeof currentValue === "string" && obj[currentValue]) {
        accumulator[currentValue] = obj[currentValue];
      }
      return accumulator;
    }, {});
  };
}
