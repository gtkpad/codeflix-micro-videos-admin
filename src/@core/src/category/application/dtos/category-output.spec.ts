import { Category } from "../../domain/entities/category";
import { CategoryOutputMapper } from "./category-output";

describe("[UNIT]: CategoryOutputMapper", () => {
  it("should map entity to output", () => {
    const entity = new Category({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    const spyToJSON = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
