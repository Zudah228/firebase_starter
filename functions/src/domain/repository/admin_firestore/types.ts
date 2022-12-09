import { firestore } from "firebase-admin";

// read
export type FirestoreDocument<T> = { entity: T } & {
  ref: FirestoreDocumentReference;
};

// write
export type FirestoreWriteType<T> = {
  [K in keyof T]: T[K] | firestore.FieldValue;
};
export type FirestoreUpdateType<T> = Partial<FirestoreWriteType<T>>;

export type QueryBuilder<T = firestore.DocumentData> = (
  getReference: (collectionPath: string) => firestore.CollectionReference<T>
) => firestore.Query<T>;

// Firestore の型をそのまま使用する
export type FirestoreGeo = firestore.GeoPoint;
export type FirestoreDocumentReference = firestore.DocumentReference;
