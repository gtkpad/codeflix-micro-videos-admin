import { CategorySequelize } from '@codeflix/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigSchemaType } from 'src/config/config.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService<ConfigSchemaType>) => {
        const models = [CategorySequelize.CategoryModel];

        if (config.get('DB_VENDOR') === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: config.get('DB_HOST'),
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
            models,
          };
        }

        if (config.get('DB_VENDOR') === 'mysql') {
          return {
            dialect: 'mysql',
            host: config.get('DB_HOST'),
            port: config.get('DB_PORT'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_DATABASE'),
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
            models,
          };
        }

        throw new Error(
          `DB_VENDOR is not supported: ${config.get('DB_VENDOR')}`,
        );
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
