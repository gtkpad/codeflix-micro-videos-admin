import { deepFreeze } from "../util/object";

export abstract class ValueObject<Value = any> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze<Value>(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = () => {
    if (typeof this._value !== "object" || this.value === null) {
      try {
        return this.value.toString();
      } catch {
        return this.value + "";
      }
    }

    const valueStr = this.value.toString();
    return valueStr === "[object Object]"
      ? JSON.stringify(this.value)
      : valueStr;
  };
}
