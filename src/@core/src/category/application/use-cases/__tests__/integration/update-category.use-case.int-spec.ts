import { Category } from '../../../../domain/entities/category';
import { NotFoundError } from '../../../../../@seedwork/domain/errors/not-found.error';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../../update-category.use-case';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import Chance from 'chance';
const chance = Chance();

type Arrange = {
  input: {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };
  expected: {
    id: string;
    name: string;
    description: null | string;
    is_active: boolean;
    created_at: Date;
  };
};

describe('[INTEGRATION] UpdateCategoryUseCase', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let updateCategoryUseCase: UpdateCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategorySequelize.CategoryRepository(
      CategorySequelize.CategoryModel,
    );
    updateCategoryUseCase = new UpdateCategoryUseCase.UseCase(
      categoryRepository,
    );
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      updateCategoryUseCase.execute({
        id: 'not-existent-id',
        name: 'category 1',
      }),
    ).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID not-existent-id'),
    );
  });

  describe('should update a category', () => {
    const item = {
      id: chance.guid({ version: 4 }),
      name: 'Category 1',
      description: null,
      is_active: true,
      created_at: new Date(),
    };

    beforeEach(async () => {
      await CategorySequelize.CategoryModel.factory().create(item);
    });

    const arrange: Arrange[] = [
      {
        input: {
          id: item.id,
          name: 'Category 2',
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
          description: 'Category 2 description',
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: true,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
          is_active: false,
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: null,
          is_active: false,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
          is_active: true,
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: item.created_at,
        },
      },
      {
        input: {
          id: item.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: false,
        },
        expected: {
          id: item.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: false,
          created_at: item.created_at,
        },
      },
    ];

    test.each(arrange)("when value is '%j'", async ({ input, expected }) => {
      const output = await updateCategoryUseCase.execute(input);
      expect(output).toStrictEqual(expected);
    });
  });
});
