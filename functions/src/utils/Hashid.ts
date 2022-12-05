import Hashids from "hashids/cjs/hashids";
import * as uuid from "uuid";


/**
 * ランダムな文字列の生成
 *
 * @param {"short" | "long"} type
 * @returns {string}
 */
 export function getHashid(type: "short" | "long" = "short"): string {
  const password = uuid.v4();
  const hashid = new Hashids(password);
  if (type === "long") {
    return hashid.encode(1, 2, 3, 4);
  } else {
    return hashid.encode(1, 2, 3);
  }
}

/**
 * 配列を、指定した数字ごとの二次元配列に変換する
 * 
 * @param {T[]} array
 * @param {number} number 
 * @returns 
 */
export const sliceByNumber = <T>(array: T[], number: number): T[][] => {
  const length = Math.ceil(array.length / number)
  return new Array(length).fill(undefined).map((_, i) => array.slice(i * number, (i + 1) * number))
}