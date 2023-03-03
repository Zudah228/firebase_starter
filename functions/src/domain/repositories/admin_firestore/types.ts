import { firestore } from "firebase-admin";
import { PartialWithFieldValue, WithFieldValue } from "firebase-admin/firestore";

import { OmitFunction } from "$src/utils/TypeHelper";

// read
export type FirestoreDocument<T> = { entity?: T; ref: FirestoreDocumentReference; exists: boolean };
export type FirestoreQueryDocument<T> = { entity: T; ref: FirestoreDocumentReference; exists: boolean };

// write
export type FirestoreWriteType<T> = OmitFunction<WithFieldValue<T>>;

export type FirestoreUpdateType<T> = PartialWithFieldValue<T>;
export type QueryBuilder<T = firestore.DocumentData> = (query: firestore.Query<T>) => firestore.Query<T>;

// Firestore の型をそのまま使用する
export type FirestoreGeo = firestore.GeoPoint;
export type FirestoreDocumentReference = firestore.DocumentReference;
