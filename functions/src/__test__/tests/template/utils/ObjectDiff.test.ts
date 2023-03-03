import { objectDiff } from "$src/utils/ObjectDiff";

describe("ObjectDiff の動作テスト", () => {
  test("プリミティブ型の diff", () => {
    const objectA = {
      name: "名前",
      age: 10,
    };
    const objectB = {
      name: "名前",
      age: 20,
    };

    const diff = objectDiff<{ name: string; age: number }>().keys(["age", "name"]).diff(objectA, objectB);

    expect(Object.keys(diff).length).toBe(1);
    expect(diff).toMatchObject({ age: 20 });
    expect(diff.name).toBeUndefined();
  });
  test("Date型の diff", () => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 1);

    const objectA = {
      name: "名前",
      date: now,
    };
    const objectB = {
      name: "名前",
      date: future,
    };

    const diff = objectDiff<{ name: string; date: Date }>().keys(["date", "name"]).diff(objectA, objectB);

    expect(Object.keys(diff).length).toBe(1);
    expect(diff).toMatchObject({ date: future });
    expect(diff.name).toBeUndefined();
  });
  test("ネストした Record 型の diff", () => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 1);

    const objectA = {
      name: "名前",
      record: {
        age: 10,
        nickname: "A",
      },
    };
    const objectB = {
      name: "名前",
      record: {
        age: 10,
        nickname: "B",
      },
    };

    const diff = objectDiff().keys(["record", "name"]).diff(objectA, objectB);

    expect(diff).toMatchObject({ record: { nickname: "B" } });
    expect(diff.record.age).toBeUndefined();
    expect(diff.name).toBeUndefined();
  });
});
