/**
 * Typescript の基本機能を補うための utility
 */

/**
 * null と undefined のチェック
 * @param {unknown} x
 * @return {boolean}
 */
export function isNull(x: unknown): x is null | undefined {
  return x === undefined || x === null;
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
 * 配列を、渡された数字ごとに分割した二次元配列にする
 *
 * @param array 分割する配列
 * @param number 個数
 * @returns
 */
export const sliceByNumber = <T>(array: T[], number: number): T[][] => {
  const length = Math.ceil(array.length / number);
  return new Array(length).fill(undefined).map((_, i) => array.slice(i * number, (i + 1) * number));
};
