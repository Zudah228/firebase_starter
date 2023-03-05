import { FirestoreHelper } from "$src/utils/firebase/FirestoreHelper";

describe("FirestoreHelper のテスト", () => {
  const pathForTrigger = "collection_1/{collection_1_id}/collection_2/{collection_2_id}/collection_3/{collection_3_id}";
  test("Path 生成関数のテスト: documentPath", () => {
    const result = FirestoreHelper.documentPathFunction(pathForTrigger)({
      collection_2_id: "id2",
      collection_1_id: "id1",
      collection_3_id: "id3",
    });

    expect(result).toBe("collection_1/id1/collection_2/id2/collection_3/id3");
  });
  test("Path 生成関数のテスト: collectionPath", () => {
    const result = FirestoreHelper.collectionPathFunction(pathForTrigger)({
      collection_2_id: "id2",
      collection_1_id: "id1",
    });

    expect(result).toBe("collection_1/id1/collection_2/id2/collection_3/");
  });
});
