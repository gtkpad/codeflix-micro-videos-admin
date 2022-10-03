import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('[UNIT] CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase.UseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    createCategoryUseCase = new CreateCategoryUseCase.UseCase(
      categoryRepository,
    );
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert');

    let output = await createCategoryUseCase.execute({ name: 'Category 1' });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryRepository.items[0].id,
      name: 'Category 1',
      description: null,
      is_active: true,
      created_at: categoryRepository.items[0].created_at,
    });

    output = await createCategoryUseCase.execute({
      name: 'Category 2',
      description: 'Description 2',
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: categoryRepository.items[1].id,
      name: 'Category 2',
      description: 'Description 2',
      is_active: false,
      created_at: categoryRepository.items[1].created_at,
    });

    output = await createCategoryUseCase.execute({
      name: 'Category 3',
      description: 'Description 3',
      is_active: true,
    });

    expect(spyInsert).toHaveBeenCalledTimes(3);
    expect(output).toStrictEqual({
      id: categoryRepository.items[2].id,
      name: 'Category 3',
      description: 'Description 3',
      is_active: true,
      created_at: categoryRepository.items[2].created_at,
    });
  });
});
