/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Function を除外した型
 *
 * getter や setter は除外できない
 */
export type OmitFunction<T> = Omit<T, PickFunctionKeys<T>>;

type PickFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * Tuple 型の、最後の要素を削除する
 */
export type DropLast<it extends any[]> = it extends readonly [...infer tail, any] ? tail : [];
