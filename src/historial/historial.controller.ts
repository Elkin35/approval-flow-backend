// approval_flow_backend/src/historial/historial.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HistorialSolicitud } from 'src/database/entities/historial-solicitud.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('historial')
export class HistorialController {
    constructor(
        @InjectRepository(HistorialSolicitud)
        private readonly historialRepository: Repository<HistorialSolicitud>
    ){}

    @Get()
    findAll() {
        return this.historialRepository.find({
            relations: ['solicitud', 'estado', 'usuarioAccion'],
            order: { fecha_cambio: 'DESC' }
        });
    }
}