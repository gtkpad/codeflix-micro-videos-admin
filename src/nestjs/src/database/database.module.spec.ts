import { Test } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as Joi from 'joi';
import { CONFIG_DB_SCHEMA } from '../config/config.module';

describe('[UNIT] DatabaseModule', () => {
  describe('sqlite connection', () => {
    const connOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be valid', () => {
      const schema = Joi.object({ ...CONFIG_DB_SCHEMA });
      const { error } = schema.validate(connOptions);

      expect(error).toBeUndefined();
    });

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const conn = app.get<Sequelize>(getConnectionToken());

      expect(conn).toBeDefined();
      expect(conn).toBeInstanceOf(Sequelize);
      expect(conn.options.dialect).toBe('sqlite');
      expect(conn.options.host).toBe(':memory:');

      await conn.close();
    });
  });
  describe('mysql connection', () => {
    const connOptions = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_DATABASE: 'test',
      DB_USERNAME: 'user',
      DB_PASSWORD: 'pass',
      DB_PORT: 3306,
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be valid', () => {
      const schema = Joi.object({ ...CONFIG_DB_SCHEMA });
      const { error } = schema.validate(connOptions);

      expect(error).toBeUndefined();
    });

    // it('should be a mysql connection', async () => {
    //   const module = await Test.createTestingModule({
    //     imports: [
    //       DatabaseModule,
    //       ConfigModule.forRoot({
    //         isGlobal: true,
    //         load: [() => connOptions],
    //       }),
    //     ],
    //   }).compile();

    //   const app = module.createNestApplication();
    //   const conn = app.get<Sequelize>(getConnectionToken());

    //   expect(conn).toBeDefined();
    //   expect(conn).toBeInstanceOf(Sequelize);
    //   expect(conn.options.dialect).toBe('mysql');
    //   expect(conn.options.host).toBe('localhost');

    //   await conn.close();
    // });
  });
});
