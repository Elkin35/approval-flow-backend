// approval_flow_backend/src/solicitudes/solicitudes.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Usuario } from 'src/database/entities/usuario.entity';
import { UpdateEstadoSolicitudDto } from './dto/update-estado-solicitud.dto';

@UseGuards(JwtAuthGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(
    @Body() createSolicitudDto: CreateSolicitudDto,
    @GetUser() solicitante: Usuario,
  ) {
    return this.solicitudesService.create(createSolicitudDto, solicitante);
  }

  @Get('inbox')
  findInbox(@GetUser() aprobador: Usuario) {
    return this.solicitudesService.findPendientesParaAprobador(aprobador.id_usuario);
  }

  @Get('outbox')
  findOutbox(@GetUser() solicitante: Usuario) {
    return this.solicitudesService.findCreadasPorUsuario(solicitante.id_usuario);
  }

  @Get('assigned-to-me')
  findAssigned(@GetUser() aprobador: Usuario) {
    return this.solicitudesService.findAssignedToAprobador(aprobador.id_usuario);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOneWithDetails(id);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoSolicitudDto,
    @GetUser() usuarioAccion: Usuario,
  ) {
    return this.solicitudesService.actualizarEstado(id, updateEstadoDto, usuarioAccion);
  }
}