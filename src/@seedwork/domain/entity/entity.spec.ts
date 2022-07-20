import { validate as uuidValidate } from "uuid";
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";
import { Entity } from "./entity";

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}

describe("[UNIT]: Entity", () => {
  it("should set props and id", () => {
    const entity = new StubEntity({ prop1: "test", prop2: 10 });
    expect(entity.props).toStrictEqual({ prop1: "test", prop2: 10 });
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBeNull();
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it("should accept a valid uuid", () => {
    const arrange = {
      prop1: "test",
      prop2: 10,
    };
    const uniqueEntityId = new UniqueEntityId(
      "df96eac1-52c9-4000-833b-e0de54d8c096"
    );

    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it("should convert a entity to json", () => {
    const arrange = {
      prop1: "test",
      prop2: 10,
    };
    const uniqueEntityId = new UniqueEntityId(
      "df96eac1-52c9-4000-833b-e0de54d8c096"
    );

    const entity = new StubEntity(arrange, uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      prop1: arrange.prop1,
      prop2: arrange.prop2,
    });
  });
});
