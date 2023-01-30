import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { ParamsOf } from "firebase-functions/lib/common/params";
import { Change, EventContext } from "firebase-functions/v1";

/**
 * FirestoreTrigger 実装に便利なものを実装
 */
abstract class FirestoreTriggerBase<T, Path extends string> {
  protected abstract decode: (data: Record<string, unknown>) => T;
  abstract get document(): Path;
}

/**
 * Firestore Trigger
 * On Write
 *
 * ex.)
 */
export abstract class FirestoreOnWriteTrigger<T, Path extends string> extends FirestoreTriggerBase<T, Path> {
  abstract onWrite: (
    change: Change<DocumentSnapshot>,
    context: EventContext<ParamsOf<Path>>
  ) => PromiseLike<void> | void;
}

/**
 * Firestore Trigger
 * On Create
 */
export abstract class FirestoreOnCreateTrigger<T, Path extends string> extends FirestoreTriggerBase<T, Path> {
  abstract onCreate: (
    snapshot: QueryDocumentSnapshot,
    context: EventContext<ParamsOf<Path>>
  ) => PromiseLike<void> | void;
}

/**
 * Firestore Trigger
 * On Update
 */
export abstract class FirestoreOnUpdateTrigger<T, Path extends string> extends FirestoreTriggerBase<T, Path> {
  abstract onUpdate: (
    change: Change<QueryDocumentSnapshot>,
    context: EventContext<ParamsOf<Path>>
  ) => PromiseLike<void> | void;
}

/**
 * Firestore Trigger
 * On Delete
 */
export abstract class FirestoreOnDeleteTrigger<T, Path extends string> extends FirestoreTriggerBase<T, Path> {
  abstract onDelete: (
    snapshot: QueryDocumentSnapshot,
    context: EventContext<ParamsOf<Path>>
  ) => PromiseLike<void> | void;
}
