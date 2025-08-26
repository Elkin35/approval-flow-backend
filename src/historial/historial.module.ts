// approval_flow_backend/src/historial/historial.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialSolicitud } from 'src/database/entities/historial-solicitud.entity';
import { HistorialController } from './historial.controller';

@Module({
    imports: [TypeOrmModule.forFeature([HistorialSolicitud])],
    controllers: [HistorialController]
})
export class HistorialModule {}