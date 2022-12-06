import { firestore } from "firebase-admin";

// read
export type FirestoreDocument<T> = { entity: T } & {
  ref: firestore.DocumentReference | firebase.default.firestore.DocumentReference;
};

// write
export type FirestoreWriteType<T> = {
  [K in keyof T]: T[K] | firestore.FieldValue;
};
export type FirestoreUpdateType<T> = Partial<FirestoreWriteType<T>>;
