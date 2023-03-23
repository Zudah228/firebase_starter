/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { AuthData } from "firebase-functions/lib/common/providers/https";
import * as functions from "firebase-functions/v1/https";

const defaultErrorMessages = {
  unauthenticated: "認証されていないユーザーです",
};

export type HttpsCallableContext = functions.CallableContext;

/**
 * Http callable 関数
 *
 * ex.)
 * const someRepository = getSomeRepository();
 * const callable = new SomeHttpsCallable(someRepository);
 *
 * export const someFunctions = endpoint.https.onCall(SomeHttpsCallable.onCall);
 */
export abstract class HttpsCallable<Res> {
  protected abstract onCallBuilder: (data: any, context: HttpsCallableContext) => Promise<Res>;
  protected abstract blockUnauthenticatedUser: boolean;

  public onCall = (data: any, context: HttpsCallableContext) => {
    if (this.blockUnauthenticatedUser && this.isAuthenticated(context)) {
      throw this.generateError("unauthenticated", defaultErrorMessages.unauthenticated);
    }

    return this.onCallBuilder(data, context);
  };

  isAuthenticated = (
    context: functions.CallableContext
  ): context is functions.CallableContext & {
    auth: AuthData;
  } => {
    return context.auth !== undefined;
  };

  protected generateError = (code: functions.FunctionsErrorCode, message: string, details?: unknown) =>
    new functions.HttpsError(code, message, details);
}
