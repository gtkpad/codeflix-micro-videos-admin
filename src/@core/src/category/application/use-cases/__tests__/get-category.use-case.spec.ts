import { Category } from "../../../domain/entities/category";
import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-in-memory.repository";
import { GetCategoryUseCase } from "../get-category.use-case";

describe("[UNIT] GetCategoryUseCase", () => {
  let useCase: GetCategoryUseCase.UseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase.UseCase(categoryRepository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "not-existent-id" })
    ).rejects.toThrow(
      new NotFoundError("Entity with id not-existent-id not found")
    );
  });

  it("should get a category", async () => {
    const spyFindById = jest.spyOn(categoryRepository, "findById");

    const items = [new Category({ name: "Category 1" })];
    categoryRepository.items = items;

    const output = await useCase.execute({ id: items[0].id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].id,
      name: items[0].name,
      description: items[0].description,
      is_active: items[0].is_active,
      created_at: items[0].created_at,
    });
  });
});
