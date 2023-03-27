import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import Chance from 'chance';
import { CategorySequelize } from './category-sequelize';

const chance = Chance();

describe('CategoryRepository', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(async () => {
    repository = new CategorySequelize.CategoryRepository(
      CategorySequelize.CategoryModel,
    );
  });

  it('should inserts a new entity', async () => {
    let category = new Category({
      name: 'Movie',
    });

    await repository.insert(category);

    let model = await CategorySequelize.CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: false,
    });

    await repository.insert(category);

    model = await CategorySequelize.CategoryModel.findByPk(category.id);
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

  it('should throw error on update when entity not found', async () => {
    const entity = new Category({ name: 'Movie' });

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`),
    );
  });

  it('should update a entity', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    entity.update({
      name: 'Movie Updated',
      description: 'some description',
    });

    await repository.update(entity);

    const foundEntity = await repository.findById(entity.id);

    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error on delete when entity not found', async () => {
    const entity = new Category({ name: 'Movie' });

    await expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`),
    );
  });

  it('should delete a entity', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`),
    );
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      await CategorySequelize.CategoryModel.factory()
        .count(16)
        .bulkCreate((i) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie`,
          description: null,
          is_active: true,
          created_at,
        }));

      const spyToEntity = jest.spyOn(
        CategorySequelize.CategoryModelMapper,
        'toEntity',
      );

      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams(),
      );

      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: `Movie`,
          description: null,
          is_active: true,
          created_at,
        }),
      );
    });

    it('should order by created_at desc when sort params are null', async () => {
      const created_at = new Date();
      await CategorySequelize.CategoryModel.factory()
        .count(16)
        .bulkCreate((i) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie-${i}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + i * 100),
        }));

      const searchResult = await repository.search(
        new CategoryRepository.SearchParams(),
      );

      expect(searchResult).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(searchResult.items).toHaveLength(15);
      searchResult.items.forEach((item, i) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
        expect(item.name).toBe(`Movie-${15 - i}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 't3st', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];

      const categories = await CategorySequelize.CategoryModel.bulkCreate(
        categoriesProp,
      );

      let result = await repository.search(
        new CategoryRepository.SearchParams({
          filter: 'test',
          per_page: 2,
          page: 1,
        }),
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'test',
        }).toJSON(true),
      );

      result = await repository.search(
        new CategoryRepository.SearchParams({
          filter: 'test',
          per_page: 2,
          page: 2,
        }),
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[3]),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'test',
        }).toJSON(true),
      );
    });

    describe('should apply paginate and sort', () => {
      let categories: CategorySequelize.CategoryModel[];

      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
      ];

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            sort: 'name',
            per_page: 2,
            page: 1,
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[1]),
              new Category(categoriesProp[0]),
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            sort: 'name',
            per_page: 2,
            page: 2,
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[4]),
              new Category(categoriesProp[2]),
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            sort: 'name',
            sort_dir: 'desc',
            per_page: 2,
            page: 1,
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[3]),
              new Category(categoriesProp[2]),
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            sort: 'name',
            sort_dir: 'desc',
            per_page: 2,
            page: 2,
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[4]),
              new Category(categoriesProp[0]),
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null,
          }),
        },
      ];

      beforeEach(async () => {
        categories = await CategorySequelize.CategoryModel.bulkCreate(
          categoriesProp,
        );
      });

      test.each(arrange)("when value is '%j'", async ({ params, result }) => {
        let searchResult = await repository.search(params);
        expect(searchResult.toJSON(true)).toMatchObject(result.toJSON(true));
      });
    });

    describe('should search using paginate, sort and filter', () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'r', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ];

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            filter: 'TEST',
            sort: 'name',
            per_page: 2,
            page: 1,
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProp[2]),
              new Category(categoriesProp[4]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            sort: 'name',
            filter: 'TEST',
            per_page: 2,
            page: 2,
          }),
          result: new CategoryRepository.SearchResult({
            items: [new Category(categoriesProp[0])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST',
          }),
        },
      ];

      beforeEach(async () => {
        await CategorySequelize.CategoryModel.bulkCreate(categoriesProp);
      });

      test.each(arrange)("when value is '%j'", async ({ params, result }) => {
        let searchResult = await repository.search(params);
        expect(searchResult.toJSON(true)).toMatchObject(result.toJSON(true));
      });
    });
  });
});
