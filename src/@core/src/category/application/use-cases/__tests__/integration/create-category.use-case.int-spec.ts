import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CreateCategoryUseCase } from '../../create-category.use-case';

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe('[INTEGRATION] CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategoryRepository(CategoryModel);
    createCategoryUseCase = new CreateCategoryUseCase.UseCase(
      categoryRepository,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        input: {
          name: 'Category 1',
        },
        expected: {
          name: 'Category 1',
          description: null,
          is_active: true,
        },
      },
      {
        input: {
          name: 'Category 2',
          description: 'Description 2',
          is_active: false,
        },
        expected: {
          name: 'Category 2',
          description: 'Description 2',
          is_active: false,
        },
      },
      {
        input: {
          name: 'Category 3',
          description: 'Description 3',
          is_active: true,
        },
        expected: {
          name: 'Category 3',
          description: 'Description 3',
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'input: $input, expected: $expected',
      async ({ input, expected }) => {
        const output = await createCategoryUseCase.execute({
          name: 'Category 3',
          description: 'Description 3',
          is_active: true,
        });

        const entity = await categoryRepository.findById(output.id);

        expect(output).toStrictEqual({
          id: entity.id,
          name: 'Category 3',
          description: 'Description 3',
          is_active: true,
          created_at: entity.created_at,
        });
      },
    );
  });
});
