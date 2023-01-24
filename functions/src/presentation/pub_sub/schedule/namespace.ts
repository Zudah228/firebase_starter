/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventContext } from "firebase-functions/v1";

export namespace PubSupTrigger {
  export type OnRunContext = EventContext<Record<string, string>>;
  /** */
  export abstract class Schedule {
    /**
     * 書式
     * * unix cron
     *   * https://www.ibm.com/docs/ja/db2/10.5?topic=task-unix-cron-format
     *
     * * App Engine
     *   * https://cloud.google.com/appengine/docs/standard/python/config/cronref#formatting_the_schedule
     */
    abstract schedule: string;
    /**
     * arrow 関数で実装
     */
    abstract onRun: (context: OnRunContext) => Promise<void>;
  }
}
