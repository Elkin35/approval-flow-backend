// approval_flow_backend/src/config/typeorm.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const port = Number(this.configService.get<number>('DB_PORT') ?? 5432);
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port,
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      schema: this.configService.get<string>('DB_SCHEMA'),
      entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
    };
  }
}