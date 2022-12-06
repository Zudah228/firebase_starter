import { Bucket } from "@google-cloud/storage";
import { Storage } from "firebase-admin/lib/storage/storage";

/**
 * Admin Cloud Storage SDK を利用するためのクラス。
 */
export class AdminCloudStorageRepository {
  constructor(storage: Storage, bucket?: string) {
    this.storageBucket = storage.bucket(bucket);
  }

  private storageBucket: Bucket;

  async delete(path: string) {
    await this.storageBucket.file(path).delete();
  }
}

export function getCloudFirebaseStorageRepository(storage: Storage, bucket?: string): AdminCloudStorageRepository {
  return new AdminCloudStorageRepository(storage, bucket);
}
