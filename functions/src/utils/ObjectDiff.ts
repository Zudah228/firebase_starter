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
    return new ObjectDiff<T, Keys>();
  };
}

/** */
class ObjectDiff<T, Keys extends FieldsOf<T>> {
  diff = (originalObj: object, updatedObj: object): Partial<ExtractKeys<T, Keys>> => {
    return deepObjectDiff.diff(originalObj, updatedObj) as Partial<ExtractKeys<T, Keys>>;
  };
}
