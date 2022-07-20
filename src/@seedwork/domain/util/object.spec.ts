import { deepFreeze } from "./object";

describe("[UNIT]: Object", () => {
  it("should not freeze a scalar value ", () => {
    const str = deepFreeze("teste");
    expect(typeof str).toBe("string");

    const num = deepFreeze(10);
    expect(typeof num).toBe("number");

    let bool = deepFreeze(true);
    expect(typeof bool).toBe("boolean");

    bool = deepFreeze(false);
    expect(typeof bool).toBe("boolean");
  });

  it("should freeze an object", () => {
    const obj = deepFreeze({
      prop1: "test",
      deep: { prop2: "test2", prop3: new Date() },
    });

    expect(() => {
      (obj as any).prop1 = "test aaaa";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => {
      (obj as any).deep.prop2 = "test aaaa";
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(obj.deep.prop3).toBeInstanceOf(Date);
  });
});
