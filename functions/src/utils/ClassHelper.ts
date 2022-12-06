export type Fields<T> = { [P in FieldNames<T>]: T[P] };

// T のメソッド (正確には値が関数であるプロパティ) 以外の名前のみを列挙する。
export type FieldNames<T> = {
  [P in keyof T]: T[P] extends (...args: unknown[]) => unknown ? never : P;
}[keyof T];
