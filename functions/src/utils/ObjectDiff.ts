/* eslint-disable @typescript-eslint/no-explicit-any */
import * as deepObjectDiff from "deep-object-diff";

/**
 *
 * @param originalObj
 * @param updatedObj
 * @returns
 */
export function objectDiff<T = any>() {
  return new ObjectDiffBuilder<T>();
}

type FieldsOf<T> = (keyof Partial<T>)[];
type ExtractKeys<T, Keys extends FieldsOf<T>> = { [P in Extract<keyof T, Keys[number]>]: T[P] };

/**
 * 比較する key の割り当て
 */
class ObjectDiffBuilder<T = any> {
  keys = <Keys extends FieldsOf<T>>(keys: Keys): ObjectDiff<T, Keys> => {
    return new ObjectDiff<T, Keys>(keys);
  };
}

/**
 * deep object diff の実行
 */
class ObjectDiff<T, Keys extends FieldsOf<T>> {
  constructor(private readonly keys: Keys) {}

  diff = (originalObj: object, updatedObj: object): Partial<ExtractKeys<T, Keys>> => {
    return deepObjectDiff.diff(this.#extract(originalObj), this.#extract(updatedObj)) as Partial<ExtractKeys<T, Keys>>;
  };

  /**
   * keys 飲みを抜き出す
   */
  #extract = (obj: object): object => {
    const extractedEntries = Object.entries(obj).filter(([key, _]) => {
      return (this.keys as string[]).includes(key);
    });
    return Object.fromEntries(extractedEntries);
  };
}
