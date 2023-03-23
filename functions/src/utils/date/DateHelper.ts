import * as dateFns from "date-fns";

/**
 * Date オブジェクトの操作などに関する Helper 関数
 */
export class DateHelper {
  static copyWith = (
    date: Date,
    years?: number,
    months?: number,
    dayOfMonth?: number,
    hours?: number,
    minutes?: number,
    seconds?: number
  ): Date => {
    let result: Date = date;
    if (years !== undefined) {
      result = dateFns.setYear(result, years);
    }
    if (months !== undefined) {
      result = dateFns.setMonth(result, months);
    }
    if (dayOfMonth !== undefined) {
      result = dateFns.setDate(result, dayOfMonth);
    }
    if (hours !== undefined) {
      result = dateFns.setHours(result, hours);
    }
    if (minutes !== undefined) {
      result = dateFns.setMinutes(result, minutes);
    }
    if (seconds !== undefined) {
      result = dateFns.setSeconds(result, seconds);
    }

    return result;
  };

  static startOfDay = (date: Date): Date => {
    return dateFns.startOfDay(date);
  };
}
