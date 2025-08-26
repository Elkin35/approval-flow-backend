// approval_flow_backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../database/entities/usuario.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Rol } from 'src/database/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol])], 
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController], 
})
export class UsersModule {}