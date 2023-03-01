import * as cloudFunctions from "firebase-functions/lib/common/params";

import { DropLast } from "$src/utils/TypeHelper";

/**
 * Firebase SDK に関する Helper 関数
 */
export class FirestoreHelper {
  static documentPathFunction<Path extends string>(
    pathForTrigger: Path
  ): (params: cloudFunctions.ParamsOf<Path>) => string {
    return (params): string => {
      return this.fromParams(pathForTrigger, params);
    };
  }
  static collectionPathFunction<Path extends string>(
    pathForTrigger: Path
  ): (params: CollectionParamsOf<Path>) => string {
    return (params): string => {
      const paths = pathForTrigger.split("/");
      paths.pop();
      const path = paths.join("/") + "/";
      return this.fromParams(path, params);
    };
  }

  private static fromParams(path: string, params: Record<string, string>): string {
    const paramKeys = Object.keys(params);
    const paramValues = Object.values(params);
    if (paramKeys.length === 0) {
      return path;
    }
    const splitPath = path.split(new RegExp("{|}"));

    return splitPath.reduce((pre, curr, index) => {
      if (index % 2 === 1) {
        return pre + paramValues[(index - 1) / 2];
      } else {
        return pre + curr;
      }
    });
  }
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
