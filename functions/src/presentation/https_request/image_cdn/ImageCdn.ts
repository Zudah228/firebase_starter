// inspired by https://gist.github.com/1amageek/a5142e9c229bafab78b75b9415efa2f6
import express from "express";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

import { endpoint } from "$src/config";
import { getAdminFirebaseStorageRepository } from "$src/domain/repositories/admin_firebase_storage/AdminFirebaseStorageRepository";
import { functionsLogger } from "$src/utils/firebase/FunctionsLogger";
import { HttpCorsHelper } from "$src/utils/http/HttpCorsHelper";

const storageRepository = getAdminFirebaseStorageRepository(getStorage());

const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;

interface Size {
  width: number;
  height: number;
}

const app = express();
// eslint-disable-next-line new-cap
const router = express.Router();
const cacheControl = "public, max-age=3600, s-maxage=36000";

const parseSize = (size: string): Size => {
  let width;
  let height;
  if (size.indexOf(",") !== -1) {
    [width, height] = size.split(",");
  } else if (size.indexOf("x") !== -1) {
    [width, height] = size.split("x");
  } else {
    [width, height] = [size, size];
  }
  width = parseInt(width, 10) || MAX_WIDTH;
  height = parseInt(height, 10) || MAX_HEIGHT;
  width = Math.min(width, MAX_WIDTH);
  height = Math.min(height, MAX_HEIGHT);

  return { width, height };
};

router.get("/s/:size/*", HttpCorsHelper.allowCrossOrigin, async (req, res, next) => {
  try {
    res.set("Cache-Control", cacheControl);
    const { size } = req.params;
    const targetSize = parseSize(size);
    const storagePath = req.path.split(`/s/${size}/`)[1];

    if ([".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG"].some((ex) => storagePath.includes(ex))) {
      // Cloud Storage からデータの取得
      const response = await storageRepository.download(storagePath);
      const originalImage = response[0];

      // 拡張子ごとに Content-Type を付与する
      if ([".jpg", ".jpeg", ".JPG", ".JPEG"].some((ex) => storagePath.includes(ex))) {
        res.type("jpg");
      } else if ([".png", ".PNG"].some((ex) => storagePath.includes(ex))) {
        res.type("png");
      }

      const sharpImage = sharp(originalImage);
      const { orientation } = await sharpImage.metadata();

      const resizedImage = await sharpImage
        // 縦横比を保持
        .withMetadata({ orientation })
        .resize({
          width: targetSize.width,
          height: targetSize.height,
        })
        .toBuffer();
      res.status(200).send(resizedImage);
    }
  } catch (error) {
    functionsLogger.error(error);
    next(error);
  }
});

router.get("*", HttpCorsHelper.allowCrossOrigin, async (req, res, next) => {
  res.set("Cache-Control", cacheControl);

  const storagePath = req.path.slice(1);

  if ([".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG"].some((ex) => storagePath.includes(ex))) {
    try {
      // Cloud Storage からデータの取得
      const response = await storageRepository.download(storagePath);
      const image = response[0];

      // 拡張子ごとに Content-Type を付与する
      if ([".jpg", ".jpeg", ".JPG", ".JPEG"].some((ex) => storagePath.includes(ex))) {
        res.type("jpg");
      } else if ([".png", ".PNG"].some((ex) => storagePath.includes(ex))) {
        res.type("png");
      }

      res.status(200).send(image);
    } catch (error) {
      next(error);
    }
  }
});

router.use((req, res, next) => {
  const err = new Error("Not Found");
  next(err);
});

// error handler
router.use((req, res, next) => {
  res.status(400).send("Bad Request");
});

app.options("*", HttpCorsHelper.allowCrossOrigin);

app.use("/", router);

export const cdn = endpoint
  .runWith({
    memory: "2GB",
  })
  .https.onRequest(app);
