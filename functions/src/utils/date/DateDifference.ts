import * as dateFns from "date-fns";

/**
 * 日付の比較
 */
export class DateDifference {
  /**
   * date が、指定された期間内のものであるかどうか
   *
   * 等値の場合、true
   * * isWithinInterval(date, { start, end: date }) // => true
   * * isWithinInterval(date, { start: date, end }) // => true
   */
  static isWithin = (date: Date, interval: dateFns.Interval) => {
    return dateFns.isWithinInterval(date, interval);
  };

  static isAfter = (date: number | Date, dateToCompare: number | Date, orEqual = true) => {
    if (orEqual) {
      return this.isEqual(date, dateToCompare);
    }
    return dateFns.isAfter(date, dateToCompare);
  };

  static isBefore = (date: number | Date, dateToCompare: number | Date, orEqual = true) => {
    if (orEqual) {
      return this.isEqual(date, dateToCompare);
    }
    return dateFns.isBefore(date, dateToCompare);
  };

  static isEqual = (date: number | Date, dateToCompare: number | Date) => {
    return dateFns.isEqual(date, dateToCompare);
  };
}
