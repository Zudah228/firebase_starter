import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Change, EventContext } from "firebase-functions/v1";

import { endpoint } from "../../../../config";
import { AdminFirestoreRepositoryJsonConverter } from "../../../../domain/repositories/admin_firestore/utils/AdminFirestoreRepositoryJsonConverter";
import { FirestoreOnWriteTrigger } from "../../../../presentation/interfaces/FirestoreTrigger";
import { TestEntity } from "../../../TestEntity";

// Todo: テストの場合のみ、export する
/** */
class TestTrigger extends FirestoreOnWriteTrigger<TestEntity, "test/{documentId}"> {
  constructor(firestore: Firestore) {
    super();
    this.firestore = firestore;
  }
  firestore: Firestore;
  get document(): "test/{documentId}" {
    return "test/{documentId}";
  }
  onWrite = (
    change: Change<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>>,
    context: EventContext<{ documentId: string }>
  ) => {
    this.firestore.doc(`testTrigger/${context.params.documentId}`).set({
      result: "success",
    });
  };
  protected decode = (data: Record<string, unknown>) =>
    new AdminFirestoreRepositoryJsonConverter(TestEntity).fromJson(data);
}

const firestore = getFirestore();

const trigger = new TestTrigger(firestore);
export const testTrigger = endpoint.firestore.document(trigger.document).onWrite(trigger.onWrite);
