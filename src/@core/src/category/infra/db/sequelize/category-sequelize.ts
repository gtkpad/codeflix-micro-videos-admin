import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model-factory';
import {
  Table,
  Column,
  PrimaryKey,
  DataType,
  Model,
} from 'sequelize-typescript';
import {
  Category,
  CategoryRepository as CategoryRepositoryContract,
} from '#category/domain';
import {
  EntityValidationError,
  LoadEntityError,
  NotFoundError,
  UniqueEntityId,
} from '#seedwork/domain';
import { Op } from 'sequelize';

import { Chance } from 'chance';
export namespace CategorySequelize {
  type CategoryModelProperties = {
    id: string;

    name: string;

    description: string | null;

    is_active: boolean;

    created_at: Date;
  };

  @Table({
    tableName: 'categories',
    timestamps: false,
  })
  export class CategoryModel extends Model<CategoryModelProperties> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory(): SequelizeModelFactory<
      CategoryModel,
      CategoryModelProperties
    > {
      const chance: Chance.Chance = require('chance')();
      return new SequelizeModelFactory<CategoryModel, CategoryModelProperties>(
        CategoryModel,
        () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          description: chance.paragraph(),
          is_active: true,
          created_at: chance.date(),
        }),
      );
    }
  }

  export class CategoryRepository
    implements CategoryRepositoryContract.Repository
  {
    sortableFields: string[] = ['name', 'created_at'];

    constructor(private categoryModel: typeof CategoryModel) {}

    public async search(
      props: CategoryRepositoryContract.SearchParams,
    ): Promise<CategoryRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;
      const { rows: models, count } = await this.categoryModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? {
              order: [[props.sort, props.sort_dir]],
            }
          : {
              order: [['created_at', 'DESC']],
            }),
        offset,
        limit,
      });

      return new CategoryRepositoryContract.SearchResult({
        items: models.map((m) => CategoryModelMapper.toEntity(m)),
        current_page: props.page,
        total: count,
        per_page: props.per_page,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir,
      });
    }

    public async insert(entity: Category): Promise<void> {
      await this.categoryModel.create(entity.toJSON());
    }

    public async findById(id: string | UniqueEntityId): Promise<Category> {
      const _id = `${id}`;
      const model = await this._get(_id);

      return CategoryModelMapper.toEntity(model);
    }

    public async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
      return models.map((model) => CategoryModelMapper.toEntity(model));
    }

    public async update(entity: Category): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    public async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);
      await this.categoryModel.destroy({ where: { id: _id } });
    }

    private async _get(id: string): Promise<CategoryModel> {
      return this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`),
      });
    }
  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel): Category {
      const { id, ...otherData } = model.toJSON();
      try {
        return new Category(otherData, new UniqueEntityId(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
