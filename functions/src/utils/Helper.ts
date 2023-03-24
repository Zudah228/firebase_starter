/**
 * Typescript の基本機能を補うための utility
 */

/**
 * null と undefined のチェック
 * @param {unknown} x
 * @return {boolean}
 */
export function isNullOrUndefined(x: unknown): x is null | undefined {
  return x === undefined || x === null;
}

/**
 * object であるかどうか。 null は許容しない
 */
export function isObject(x: unknown): x is object {
  return x !== null && typeof x === "object";
}

/**
 * 一定時間待機する
 *
 * @param milliseconds
 */
export async function wait(milliseconds?: number) {
  await new Promise((r) => setTimeout(r, milliseconds ?? 2500));
}

/**
 * never をアサインするための関数
 * switch の抜け漏れ防止実装に利用
 *
 * @example
 * type Animal = "cat" | "dog"
 *
 * switch (animal) {
 *   case "cat":
 *    break;
 *   case "dog":
 *    break;
 *   default:
 *    throw assertNever(animal);
 * }
 */
export function assertNever(_: never) {
  return new Error("This code should not be called");
}

/**
 * 配列を、渡された数字ごとに分割した二次元配列にする
 *
 * ex.) const result = sliceByNumber(["a", "b", "c", "d"], 2)
 *
 * => [["a", "b"], ["c", "d"]]
 *
 *
 * @param array 分割する配列
 * @param {number} elementLength 二次元配列の要素の個数
 * @returns
 */
export const sliceToTwoDimensionalArray = <T>(array: T[], elementLength: number): T[][] => {
  const length = Math.ceil(array.length / elementLength);
  return new Array(length).fill(undefined).map((_, i) => {
    return array.slice(i * elementLength, (i + 1) * elementLength);
  });
};
