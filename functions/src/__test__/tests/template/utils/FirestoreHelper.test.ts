import { FirestoreHelper } from "$src/utils/firebase/FirestoreHelper";

describe("FirestoreHelper のテスト", () => {
  const pathForTrigger = "collection_1/{collection_1_id}/collection_2/{collection_2_id}";
  test("Path 生成関数のテスト: documentPath", () => {
    const result = FirestoreHelper.documentPathFunction(pathForTrigger)({
      collection_1_id: "id1",
      collection_2_id: "id2",
    });

    expect(result).toBe("collection_1/id1/collection_2/id2");
  });
  test("Path 生成関数のテスト: collectionPath", () => {
    const result = FirestoreHelper.collectionPathFunction(pathForTrigger)({
      collection_1_id: "id1",
    });

    expect(result).toBe("collection_1/id1/collection_2/");
  });
});
