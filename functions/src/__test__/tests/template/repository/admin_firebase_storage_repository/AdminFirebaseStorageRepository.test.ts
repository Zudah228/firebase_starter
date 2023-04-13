import * as fs from "fs";

import { FirebaseUnitTest } from "$test/index";

describe("Admin Firebase Storage Repository のテスト", () => {
  let firebaseUnitTest: FirebaseUnitTest;

  const filePath = "test/sample.png";
  let buffer: Buffer;

  beforeAll(async () => {
    firebaseUnitTest = await FirebaseUnitTest.setUp();
    buffer = firebaseUnitTest.samplePngImage();
  });

  afterEach(async () => {
    await firebaseUnitTest.dispose();
  });

  test("保存", async () => {
    // 画像を保存
    await firebaseUnitTest.withAdminSdk(async (_, storage) => {
      await storage.save(filePath, buffer);
    });

    // 取得して確認
    await firebaseUnitTest.withSecurityRulesDisabled(async (_, storage) => {
      const url = await storage.ref(filePath).getDownloadURL();
      expect(url).toBeDefined();
    });
  });
  test("削除", async () => {
    const buffer = fs.readFileSync(`${__dirname}/../../../assets/sample_image.png`);

    // 画像を保存 => 削除
    await firebaseUnitTest.withAdminSdk(async (_, storage) => {
      await storage.save(filePath, buffer);
      await storage.delete(filePath);
    });

    // 取得の失敗
    await firebaseUnitTest.withSecurityRulesDisabled(async (_, storage) => {
      const result = await firebaseUnitTest.causeError(storage.ref(filePath).getDownloadURL);
      expect(result).toEqual(true);
    });
  });
});
