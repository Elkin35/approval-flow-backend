// approval_flow_backend/src/database/seeding/seeding.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { SeedingService } from './seeding.service';
import { EstadoSolicitud } from '../entities/estado-solicitud.entity';
import { TipoSolicitud } from '../entities/tipo-solicitud.entity';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Rol, 
        EstadoSolicitud, 
        TipoSolicitud, 
        Usuario
    ]),
  ],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}