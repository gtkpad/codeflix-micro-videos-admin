import { Model } from 'sequelize-typescript';

export class SequelizeModelFactory<ModelClass extends Model, ModelProps = any> {
  private _count = 1;
  constructor(private model, private dafaultFactoryProps: () => ModelProps) {}

  count(count: number) {
    this._count = count;
    return this;
  }

  async create(data?: ModelProps): Promise<ModelClass> {
    return this.model.create(data ? data : this.dafaultFactoryProps());
  }

  make(data?: ModelProps): ModelClass {
    return this.model.build(data ? data : this.dafaultFactoryProps());
  }

  async bulkCreate(
    factoryProps?: (index: number) => ModelProps,
  ): Promise<ModelClass[]> {
    return this.model.bulkCreate(
      new Array(this._count)
        .fill(factoryProps ? factoryProps : this.dafaultFactoryProps)
        .map((factory, index) => factory(index)),
    );
  }

  bulkMake(factoryProps?: (index: number) => ModelProps): ModelClass[] {
    return this.model.bulkBuild(
      new Array(this._count)
        .fill(factoryProps ? factoryProps : this.dafaultFactoryProps)
        .map((factory, index) => factory(index)),
    );
  }
}
