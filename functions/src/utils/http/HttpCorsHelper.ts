import * as cors from "cors";
import express from "express";

import { whiteList } from "$src/config";

/**
 * Cross Origin の許可
 */
export class HttpCorsHelper {
  static allowCrossOrigin = (req: cors.CorsRequest, res: express.Response, next: express.NextFunction) => {
    const methods = "GET, POST, OPTIONS";
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "");
    res.setHeader("Access-Control-Allow-Methods", methods);

    cors.default({
      origin: (origin, callback) => {
        if (!origin || whiteList.some((v) => origin.startsWith(v))) {
          callback(null, true);
          return;
        }
        callback(new Error("Not Allowed Origin"));
      },
      methods,
      preflightContinue: true,
      credentials: true,
      optionsSuccessStatus: 200,
    })(req, res, next);
  };
}
