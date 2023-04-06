import { Bucket, DownloadResponse } from "@google-cloud/storage";
import { Storage } from "firebase-admin/lib/storage/storage";

/**
 * Admin Cloud Storage SDK を利用するためのクラス。
 */
export class AdminCloudStorageRepository {
  constructor(storage: Storage, bucket?: string) {
    this.storageBucket = storage.bucket(bucket);
  }

  private storageBucket: Bucket;

  save = async (path: string, buffer: string | Buffer): Promise<void> => {
    await this.storageBucket.file(path).save(buffer);
  };

  delete = async (path: string): Promise<void> => {
    await this.storageBucket.file(path).delete();
  };

  download = async (path: string): Promise<DownloadResponse> => {
    return this.storageBucket.file(path).download();
  };
}

export function getAdminCloudStorageRepository(storage: Storage, bucket?: string): AdminCloudStorageRepository {
  return new AdminCloudStorageRepository(storage, bucket);
}
