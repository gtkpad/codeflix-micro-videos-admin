import { Category } from '../../../../domain/entities/category';
import { NotFoundError } from '../../../../../@seedwork/domain/errors/not-found.error';
import { DeleteCategoryUseCase } from '../../delete-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe('[INTEGRATION] DeleteCategoryUseCase', () => {
  setupSequelize({ models: [CategoryModel] });
  let deleteCategoryUseCase: DeleteCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepository(CategoryModel);
    deleteCategoryUseCase = new DeleteCategoryUseCase.UseCase(
      categoryRepository,
    );
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      deleteCategoryUseCase.execute({
        id: 'not-existent-id',
      }),
    ).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID not-existent-id'),
    );
  });

  it('should delete a category', async () => {
    const model = await CategoryModel.factory().create();

    await deleteCategoryUseCase.execute({
      id: model.id,
    });
    const findedModel = await CategoryModel.findByPk(model.id);
    expect(findedModel).toBeNull();
  });
});
