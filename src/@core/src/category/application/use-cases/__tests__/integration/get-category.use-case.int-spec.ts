import { Category } from '../../../../domain/entities/category';
import { NotFoundError } from '../../../../../@seedwork/domain/errors/not-found.error';
import { GetCategoryUseCase } from '../../get-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';

describe('[INTEGRATION] GetCategoryUseCase', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let useCase: GetCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategorySequelize.CategoryRepository(
      CategorySequelize.CategoryModel,
    );
    useCase = new GetCategoryUseCase.UseCase(categoryRepository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'not-existent-id' }),
    ).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID not-existent-id'),
    );
  });

  it('should get a category', async () => {
    const model = await CategorySequelize.CategoryModel.factory().create();

    const output = await useCase.execute({ id: model.id });

    expect(output).toStrictEqual({
      id: model.id,
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
  });
});
