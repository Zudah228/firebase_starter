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