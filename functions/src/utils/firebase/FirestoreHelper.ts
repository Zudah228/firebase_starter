import * as cloudFunctions from "firebase-functions/lib/common/params";

import { DropLast } from "$src/utils/TypeHelper";

/**
 * Firebase SDK に関する Helper 関数
 */
export class FirestoreHelper {
  /**
   * firestore trigger に設定するパスの文字列から、ドキュメントパスを生成するための、型安全な関数を生成する
   *
   * @param {string} pathForTrigger - "users/{userId}"
   *
   * @example
   * const pathForTrigger = "users/{userId}/posts/{postId}";
   *
   * const documentPath = FirestoreHelper.documentPathFunction(pathForTrigger)
   *
   * const userId = "user_1"
   * const postId = "post_1"
   *
   * const ref = firestore.doc(documentPath({userId: userId, postId: postId }))
   */
  static documentPathFunction = <Path extends string>(
    pathForTrigger: Path
  ): ((params: cloudFunctions.ParamsOf<Path>) => string) => {
    return (params): string => {
      return this.#fromParams(pathForTrigger, params);
    };
  };

  /**
   * firestore trigger に設定するパスの文字列から、コレクションパスを生成するための、型安全な関数を生成する
   *
   * @param {string} pathForTrigger - "users/{userId}"
   *
   * @example
   * const pathForTrigger = "users/{userId}/posts/{postId}";
   *
   * const collectionPath = FirestoreHelper.collectionPathFunction(pathForTrigger)
   *
   * const userId = "user_1"
   *
   * const ref = firestore.collection(collectionPath({userId: userId, postId: postId }))
   */
  static collectionPathFunction = <Path extends string>(
    pathForTrigger: Path
  ): ((params: CollectionParamsOf<Path>) => string) => {
    return (params): string => {
      // 最後の Id を削除
      const paths = pathForTrigger.split("/");
      paths.pop();
      const path = paths.join("/") + "/";

      return this.#fromParams(path, params);
    };
  };

  /**
   * firestore trigger に設定するパスの文字列から、コレクショングループのIDを生成するための、型安全な関数を生成する
   *
   * @param {string} pathForTrigger - "users/{userId}"
   */
  static collectionId = <Path extends string>(pathForTrigger: Path): string => {
    const pathValues = pathForTrigger.split("/");
    const index = pathForTrigger.endsWith("/") ? pathValues.length - 3 : pathValues.length - 2;
    return pathValues[index];
  };

  /**
   * "/" の重複を防止できる、パスの結合
   *
   * @example
   * /// "/" が最後に含まれていない
   * const rootPath = "users/uid";
   * const subPath = "post/postId";
   *
   * const userPostDocumentPath = FirestoreHelper.mergePath(rootPath, subPath);
   * /// * => "users/uid/post/postId"
   * @example
   * /// "/" が最後に含まれている
   * const rootPath = "users/uid/";
   * const subPath = "post/postId";
   *
   * const userPostDocumentPath = FirestoreHelper.mergePath(rootPath, subPath);
   * /// * => "users/uid/post/postId"
   */
  static mergePath = (rootPath: string, subPath: string): string => {
    return rootPath.endsWith("/") ? rootPath + subPath : rootPath + "/" + subPath;
  };

  static #fromParams = (path: string, params: Record<string, string>): string => {
    const paramKeys = Object.keys(params);
    if (paramKeys.length === 0) {
      return path;
    }
    const splitPath = path.split(new RegExp("{|}"));

    return splitPath.reduce((pre, curr, index) => {
      if (index % 2 === 1) {
        return pre + params[paramKeys.find((v) => v === curr)!];
      } else {
        return pre + curr;
      }
    });
  };
}

/**
 * inspired by "firebase-functions/lib/common/params" ParamsOf
 */
type CollectionParamsOf<PathPattern extends string> = string extends PathPattern
  ? Record<string, string>
  : {
      [Key in cloudFunctions.Extract<
        DropLast<cloudFunctions.Split<cloudFunctions.NullSafe<PathPattern>, "/">>[number]
      >]: string;
    };
