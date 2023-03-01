import { EventContext } from "firebase-functions/v1";
import { UserRecord } from "firebase-functions/v1/auth";

/** */
export abstract class AuthOnCreateTrigger {
  abstract onCreate: (user: UserRecord, context: EventContext) => PromiseLike<void> | void;
}
