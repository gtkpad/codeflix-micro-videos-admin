import { Category } from "../../../domain/entities/category";
import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("[UNIT] DeleteCategoryUseCase", () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      deleteCategoryUseCase.execute({
        id: "not-existent-id",
      })
    ).rejects.toThrow(
      new NotFoundError("Entity with id not-existent-id not found")
    );
  });

  it("should delete a category", async () => {
    const spyDelete = jest.spyOn(categoryRepository, "delete");
    const entity = new Category({
      name: "Category 1",
    });

    categoryRepository.items = [entity];

    await deleteCategoryUseCase.execute({
      id: entity.id,
    });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(categoryRepository.items).toHaveLength(0);
  });
});
