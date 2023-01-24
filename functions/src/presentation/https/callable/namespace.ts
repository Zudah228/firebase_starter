/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import * as functions from "firebase-functions/v1/https";

import { CloudFunctionsHelper } from "@/utils/CloudFunctionsHelper";

export namespace HttpsCallable {
  const defaultErrorMessages = {
    unauthenticated: "認証されていないユーザーです",
  };
  export type CallableContext = functions.CallableContext;
  /**
   * Http callable 関数
   */
  export abstract class HttpsCallable<Res> {
    protected abstract onCallBuilder: (data: any, context: CallableContext) => Promise<Res>;
    protected abstract blockUnauthenticatedUser: boolean;

    /**
     *
     * @param data arrow 関数で実装
     * @param context
     * @returns
     */
    public onCall = (data: any, context: CallableContext) => {
      if (this.blockUnauthenticatedUser && CloudFunctionsHelper.isAuthenticated(context)) {
        throw this.throwError("unauthenticated", defaultErrorMessages.unauthenticated);
      }

      return this.onCallBuilder(data, context);
    };

    protected throwError = CloudFunctionsHelper.generateHttpsError;
  }
}
