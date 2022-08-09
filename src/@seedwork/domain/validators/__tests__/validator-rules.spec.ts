import { ValidationError } from "../../errors/validation-error";
import { ValidatorRules } from "../validator-rules";

type AssertProps = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error?: ValidationError;
  params?: any[];
};

type Values = {
  value: any;
  property: string;
};

function assertIsInvalid(assert: AssertProps): void {
  expect(() => {
    runRule(assert);
  }).toThrow(assert.error);
}

function assertIsValid(assert: AssertProps) {
  expect(() => {
    runRule(assert);
  }).not.toThrow();
}

function runRule({
  property,
  rule,
  value,
  params,
}: Omit<AssertProps, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  method.apply(validator, params);
}

describe("[UNIT]: ValidatorRules", () => {
  it("should set values", () => {
    const validator = ValidatorRules.values("some value", "field");

    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  it("should validate required", () => {
    const validCases = [
      { value: "some value", property: "field" },
      { value: 100, property: "field" },
      { value: {}, property: "field" },
      { value: true, property: "field" },
      { value: 0, property: "field" },
      { value: false, property: "field" },
      { value: -5, property: "field" },
    ];
    const invalidCases: Values[] = [
      { value: null, property: "field1" },
      { value: undefined, property: "field1" },
      { value: "", property: "field1" },
      { value: null, property: "other_field" },
      {
        value: undefined,
        property: "other_field",
      },
      { value: "", property: "other_field" },
    ];

    validCases.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
      });
    });

    invalidCases.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError(`${item.property} is required`),
      });
    });
  });

  it("should validate maxLength", () => {
    const validCases = [
      { value: "some", property: "field" },
      { value: "valid", property: "field" },
      { value: "test", property: "field" },
      { value: "lol", property: "field" },
      { value: "", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];
    const invalidCases: Values[] = [
      { value: "test invalid", property: "field1" },
      { value: "invalid case", property: "field1" },
    ];

    validCases.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        params: [5],
      });
    });

    invalidCases.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        params: [5],
        error: new ValidationError(
          `${item.property} must be less or equal than 5 characters`
        ),
      });
    });
  });

  it("should validate string", () => {
    const validCases = [
      { value: "some value", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];
    const invalidCases: Values[] = [
      { value: 0, property: "field1" },
      { value: {}, property: "field1" },
      { value: false, property: "field1" },
    ];

    validCases.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
      });
    });

    invalidCases.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidationError(`${item.property} must be a string`),
      });
    });
  });

  it("should validate boolean", () => {
    const validCases = [
      { value: true, property: "field" },
      { value: false, property: "field" },
    ];
    const invalidCases: Values[] = [
      { value: 0, property: "field1" },
      { value: 1, property: "field1" },
      { value: {}, property: "field1" },
      { value: "false", property: "field1" },
      { value: "true", property: "field1" },
    ];

    validCases.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
      });
    });

    invalidCases.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error: new ValidationError(`${item.property} must be a boolean`),
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("field is required")
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("field must be a string")
    );

    validator = ValidatorRules.values("123456", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values("123456", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("field is required")
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("field must be a boolean")
    );
  });

  it("should valid when combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.values(null, "field").string();
    ValidatorRules.values(undefined, "field").string();
    ValidatorRules.values(null, "field").boolean();
    ValidatorRules.values(undefined, "field").boolean();
    ValidatorRules.values(null, "field").maxLength(5);
    ValidatorRules.values(undefined, "field").maxLength(5);

    ValidatorRules.values("test", "field").required().string().maxLength(5);
    ValidatorRules.values("test", "field").required().string().maxLength(5);
    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});
