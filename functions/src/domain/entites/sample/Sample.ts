import { FirestoreHelper } from "$src/utils/firebase/FirestoreHelper";

export interface Sample {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export namespace Sample {
  export const documentPathForTrigger = "samples/{sampleId}/docs/{docId}";
  export const documentPath = FirestoreHelper.documentPathFunction(documentPathForTrigger);
  export const collectionPath = FirestoreHelper.collectionPathFunction(documentPathForTrigger);
}

Sample.collectionPath({ sampleId: "s" });
Sample.documentPath({ sampleId: "aaa", docId: "doc" });
