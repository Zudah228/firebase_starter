/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { ParamsOf } from "firebase-functions/lib/common/params";
import { Change, EventContext } from "firebase-functions/v1";

/**
 * FirestoreTrigger 実装に便利なものを実装
 */
abstract class FirestoreTriggerBase<T> {
  protected abstract decode: (data: any) => T;
}

/**
 * Firestore Trigger
 *
 * ex.)
 */
export abstract class FirestoreOnWriteTrigger<T, Path extends string> extends FirestoreTriggerBase<T> {
  protected abstract decode: (data: any) => T;

  /** Respond to all document writes (creates, updates, or deletes). */
  abstract onWrite: (change: Change<DocumentSnapshot>, context: EventContext<ParamsOf<Path>>) => PromiseLike<any> | any;
  /** Respond only to document updates. */
  // abstract onUpdate: (
  //   change: Change<QueryDocumentSnapshot>,
  //   context: EventContext<ParamsOf<Path>>
  // ) => PromiseLike<any> | any;
  // /** Respond only to document creations. */
  // abstract onCreate: (snapshot: QueryDocumentSnapshot, context: EventContext<ParamsOf<Path>>) => PromiseLike<any> | any;
  // /** Respond only to document deletions. */
  // abstract onDelete: (snapshot: QueryDocumentSnapshot, context: EventContext<ParamsOf<Path>>) => PromiseLike<any> | any;
}
