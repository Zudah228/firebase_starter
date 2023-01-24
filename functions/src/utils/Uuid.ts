import Hashids from "hashids/cjs/hashids";
import * as uuid from "uuid";

/**
 * ランダムな文字列の生成
 * バックグラウンド関数では、冪等性を担保する必要があるため、推奨しない。
 *
 * @param {"short" | "long"} hashType
 * @returns {string}
 */
export function generateUuid(hashType?: "short" | "long"): string {
  const password = uuid.v4();
  if (hashType === undefined) {
    return password;
  }
  const hashid = new Hashids(password);
  if (hashType === "long") {
    return hashid.encode(1, 2, 3, 4);
  } else {
    return hashid.encode(1, 2, 3);
  }
}
