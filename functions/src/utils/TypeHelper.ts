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
 *
 * @example
 * type Animal = ["cat" , "dog", "bird"]
 *
 * type DroppedAnimal = DropLast<Animal>
 * ///  -> ["cat" , "dog"]
 */
export type DropLast<it extends any[]> = it extends readonly [...infer tail, any] ? tail : [];
