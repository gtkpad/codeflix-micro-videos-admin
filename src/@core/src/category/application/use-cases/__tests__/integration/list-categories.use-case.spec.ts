import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { Category } from '../../../../domain/entities/category';
import { CategoryRepository } from '../../../../domain/repository/category.repository';
import { ListCategoriesUseCase } from '../../list-categories.use-case';
import Chance from 'chance';
const chance = Chance();

describe('[INTEGRATTION] ListCategoriesUseCase', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let useCase: ListCategoriesUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategorySequelize.CategoryRepository(
      CategorySequelize.CategoryModel,
    );
    useCase = new ListCategoriesUseCase.UseCase(categoryRepository);
  });

  it('should return output using empty input with categories ordered by created_at', async () => {
    const created_at = new Date();
    const models = await CategorySequelize.CategoryModel.factory()
      .count(2)
      .bulkCreate((i) => ({
        id: chance.guid({ version: 4 }),
        name: `Category ${i}`,
        description: `Category ${i} description`,
        is_active: true,
        created_at: new Date(created_at.getTime() + i * 1000),
      }));

    const output = await useCase.execute({});
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const models = CategorySequelize.CategoryModel.factory()
      .count(5)
      .bulkMake();
    models[0].name = 'a';
    models[1].name = 'AAA';
    models[2].name = 'AaA';
    models[3].name = 'b';
    models[4].name = 'c';

    await CategorySequelize.CategoryModel.bulkCreate(
      models.map((i) => i.toJSON()),
    );

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[0]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[0], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[1]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});
