import { Category } from '../../../domain/entities/category';
import { NotFoundError } from '../../../../@seedwork/domain/errors/not-found.error';
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

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

describe('[UNIT] UpdateCategoryUseCase', () => {
  let updateCategoryUseCase: UpdateCategoryUseCase.UseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
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
      new NotFoundError('Entity with id not-existent-id not found'),
    );
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = new Category({
      name: 'Category 1',
    });

    categoryRepository.items = [entity];

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          name: 'Category 2',
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
          description: 'Category 2 description',
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
          is_active: true,
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: null,
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: false,
        },
        expected: {
          id: entity.id,
          name: 'Category 2',
          description: 'Category 2 description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];
    let calledTimes = 0;
    for (const i of arrange) {
      calledTimes++;
      const output = await updateCategoryUseCase.execute(i.input);
      expect(spyUpdate).toHaveBeenCalledTimes(calledTimes);
      expect(output).toStrictEqual(i.expected);
    }
  });
});
