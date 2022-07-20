import { InvalidUuidError } from "../../../errors/invalid-uuid.error";
import { UniqueEntityId } from "../unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";

describe("[UNIT]: UniqueEntityId", () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  it("should create a unique entity id", () => {
    const id = new UniqueEntityId();
    expect(uuidValidate(id.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(id).toBeInstanceOf(UniqueEntityId);
  });

  it("should create a unique entity id with id", () => {
    const id = new UniqueEntityId("df96eac1-52c9-4000-833b-e0de54d8c096");
    expect(id.value).toBe("df96eac1-52c9-4000-833b-e0de54d8c096");
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(id).toBeInstanceOf(UniqueEntityId);
  });

  it("should throw error when uuid is invalid", () => {
    expect(() => {
      new UniqueEntityId("invalid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
