import { ClassValidatorFields } from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubClassValidator extends ClassValidatorFields<{ field: string }> {}

describe("[UNIT]: ClassValidatorFields", () => {
  it("should initialize errors and validateData with null", () => {
    const validator = new StubClassValidator();

    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([
      { property: "field", constraints: { isRequired: "Field is required" } },
    ]);

    const validator = new StubClassValidator();
    expect(validator.validate({ field: null })).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({
      field: ["Field is required"],
    });
  });

  it("should validate without errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([]);

    const validator = new StubClassValidator();
    expect(validator.validate({ field: "Value" })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(validator.validatedData).toStrictEqual({ field: "Value" });
    expect(validator.errors).toBeNull();
  });
});
