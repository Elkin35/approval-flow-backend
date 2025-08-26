// approval_flow_backend/src/tipos-solicitud/tipos-solicitud.controller.ts
import { Controller, Get, Post, Body, UseGuards, ConflictException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TipoSolicitud } from 'src/database/entities/tipo-solicitud.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTipoSolicitudDto } from './dto/create-tipo-solicitud.dto';
import { QueryFailedError } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('tipos-solicitud')
export class TiposSolicitudController {
    constructor(
        @InjectRepository(TipoSolicitud)
        private readonly tipoRepository: Repository<TipoSolicitud>
    ) {}
    
    @Get()
    findAll() {
        return this.tipoRepository.find();
    }

    @Post()
    async create(@Body() createTipoDto: CreateTipoSolicitudDto) {
        try {
            const nuevoTipo = this.tipoRepository.create(createTipoDto);
            return await this.tipoRepository.save(nuevoTipo);
        } catch (error) {

            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new ConflictException(`El tipo de solicitud '${createTipoDto.nombre}' ya existe.`);
            }
            throw error;
        }
    }
}