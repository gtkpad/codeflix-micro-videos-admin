import { Category } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category-model';
import { CategorySequelizeRepository } from './category-repository';

describe('CategorySequelizeRepository', () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should inserts a new entity', async () => {
    let category = new Category({
      name: 'Movie',
    });

    await repository.insert(category);

    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: false,
    });

    await repository.insert(category);

    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should throws error when entity not found', async () => {
    await expect(repository.findById('fake-id')).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id'),
    );

    await expect(
      repository.findById(
        new UniqueEntityId('37a49722-e7fb-4508-8fdb-168a431975f0'),
      ),
    ).rejects.toThrow(
      new NotFoundError(
        'Entity Not Found using ID 37a49722-e7fb-4508-8fdb-168a431975f0',
      ),
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    let foundEntity = await repository.findById(entity.id);

    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());

    foundEntity = await repository.findById(entity.uniqueEntityId);

    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should returns all categories', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);
    const entities = await repository.findAll();

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('search', async () => {
    await CategoryModel.factory().create();
    const data = await repository.findAll();

    console.log(data);
  });
});
