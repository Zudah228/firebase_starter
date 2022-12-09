/**
 * Function を除外した型
 *
 * getter や setter は除外できない
 */
export type OmitFunction<T> = Omit<T, PickFunction<T>>;

type PickFunction<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
