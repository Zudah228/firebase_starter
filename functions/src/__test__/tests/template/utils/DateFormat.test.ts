import { dateFormat } from "$src/utils/date/DateFormat";

describe("DateFormat のテスト", () => {
  beforeAll(() => {
    dateFormat.setLocale("ja");
  });
  test("正しい文字列になっている", () => {
    const now = new Date(2000, 3, 10);

    const formatted = dateFormat.format(now, "yyyy 'year' M 'month' dd 'day'");
    expect(formatted).toBe("2000 year 2 month 10 day");
  });
});
