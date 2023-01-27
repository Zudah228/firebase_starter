/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventContext } from "firebase-functions/v1";

export type SchedulerContext = EventContext<Record<string, string>>;
/** */
export abstract class PubSubScheduler {
  /**
   * 書式
   * * unix cron
   *   * https://www.ibm.com/docs/ja/db2/10.5?topic=task-unix-cron-format
   *
   * * App Engine
   *   * https://cloud.google.com/appengine/docs/standard/python/config/cronref#formatting_the_PubSubscheduler
   */
  abstract PubSubScheduler: string;
  /**
   * arrow 関数で実装
   */
  abstract onRun: (context: SchedulerContext) => Promise<void>;
}
