// approval_flow_backend/src/tipos-solicitud/tipos-solicitud.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSolicitud } from 'src/database/entities/tipo-solicitud.entity';
import { TiposSolicitudController } from './tipos-solicitud.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TipoSolicitud])],
    controllers: [TiposSolicitudController]
})
export class TiposSolicitudModule {}