/**
 * Function を除外した型
 *
 * getter や setter は除外できない
 */
export type OmitFunction<T> = Omit<T, PickFunctionKeys<T>>;
export type PickFunction<T> = Omit<T, OmitFunctionKeys<T>>;

export type PickFunctionKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type OmitFunctionKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
