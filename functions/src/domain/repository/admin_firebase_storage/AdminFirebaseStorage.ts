import { Bucket } from "@google-cloud/storage";
import { Storage } from "firebase-admin/lib/storage/storage";

/**
 * Admin Firebase Cloud Storage SDK を利用するためのクラス。
 */
export class AdminFirebaseStorageRepository {
  constructor(storage: Storage, bucket?: string) {
    this.storageBucket = storage.bucket(bucket);
  }

  private storageBucket: Bucket;

  async delete(path: string) {
    await this.storageBucket.file(path).delete();
  }
}

export function getAdminFirebaseStorageRepository(storage: Storage, bucket?: string): AdminFirebaseStorageRepository {
  return new AdminFirebaseStorageRepository(storage, bucket);
}
