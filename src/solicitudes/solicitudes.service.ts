//approval_flow_backend/src/solicitudes/solicitudes.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { Solicitud } from '../database/entities/solicitud.entity';
import { Usuario } from '../database/entities/usuario.entity';
import { ESTADOS_SOLICITUD } from '../common/enums/estados-solicitud.enum';
import { EstadoSolicitud } from 'src/database/entities/estado-solicitud.entity';
import { TipoSolicitud } from 'src/database/entities/tipo-solicitud.entity';
import { HistorialSolicitud } from 'src/database/entities/historial-solicitud.entity';
import { UpdateEstadoSolicitudDto } from './dto/update-estado-solicitud.dto';
import { MailService } from 'src/mail/mail.service'; // <-- IMPORTADO

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(EstadoSolicitud)
    private estadoRepository: Repository<EstadoSolicitud>,
    @InjectRepository(TipoSolicitud)
    private tipoRepository: Repository<TipoSolicitud>,
    private dataSource: DataSource,
    private readonly mailService: MailService, // <-- INYECTADO
  ) {}

  async create(createSolicitudDto: CreateSolicitudDto, solicitante: Usuario): Promise<Solicitud> {
    const { titulo, descripcion, id_tipo, id_aprobador } = createSolicitudDto; // <-- CAMBIADO

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tipo = await queryRunner.manager.findOneBy(TipoSolicitud, { id_tipo });
      if (!tipo) throw new NotFoundException(`Tipo de solicitud con ID ${id_tipo} no encontrado.`);
      
      const aprobador = await queryRunner.manager.findOneBy(Usuario, { id_usuario: id_aprobador });
      if (!aprobador) {
        throw new NotFoundException(`Aprobador con ID ${id_aprobador} no fue encontrado.`);
      }
      
      const estadoPendiente = await queryRunner.manager.findOneBy(EstadoSolicitud, { nombre: ESTADOS_SOLICITUD.PENDIENTE });
      if (!estadoPendiente) throw new NotFoundException('Estado "Pendiente" no encontrado en la base de datos.');

      const nuevaSolicitud = new Solicitud();
      nuevaSolicitud.titulo = titulo;
      nuevaSolicitud.descripcion = descripcion;
      nuevaSolicitud.solicitante = solicitante;
      nuevaSolicitud.tipo = tipo;
      nuevaSolicitud.estadoActual = estadoPendiente;
      nuevaSolicitud.aprobadores = [aprobador];

      const solicitudGuardada = await queryRunner.manager.save(nuevaSolicitud);

      const historialInicial = new HistorialSolicitud();
      historialInicial.solicitud = solicitudGuardada;
      historialInicial.estado = estadoPendiente;
      historialInicial.comentario = 'Creación de la solicitud.';
      historialInicial.usuarioAccion = solicitante;
      await queryRunner.manager.save(historialInicial);

      await queryRunner.commitTransaction();

      // Obtenemos la solicitud completa para el correo
      const solicitudCompleta = await this.findOneWithDetails(solicitudGuardada.id_solicitud);
      
      // Enviamos la notificación por correo
      await this.mailService.sendNewRequestNotification(solicitudCompleta);

      return solicitudCompleta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  

  async findPendientesParaAprobador(aprobadorId: number): Promise<Solicitud[]> {
    return this.solicitudRepository
      .createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.solicitante', 'solicitante')
      .leftJoinAndSelect('solicitud.estadoActual', 'estadoActual')
      .leftJoinAndSelect('solicitud.tipo', 'tipo')
      .innerJoin('solicitud.aprobadores', 'aprobador', 'aprobador.id_usuario = :aprobadorId', { aprobadorId })
      .where('estadoActual.nombre = :estado', { estado: ESTADOS_SOLICITUD.PENDIENTE })
      .orderBy('solicitud.fecha_creacion', 'DESC')
      .getMany();
  }

  async findCreadasPorUsuario(solicitanteId: number): Promise<Solicitud[]> {
    return this.solicitudRepository.find({
      where: { solicitante: { id_usuario: solicitanteId } },
      relations: ['estadoActual', 'tipo', 'aprobadores', 'solicitante'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findOneWithDetails(id: string): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitud: id },
      relations: ['solicitante', 'estadoActual', 'tipo', 'aprobadores', 'historial', 'historial.usuarioAccion', 'historial.estado'],
      order: { historial: { fecha_cambio: 'ASC' } },
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);
    }
    return solicitud;
  }

  async actualizarEstado(id: string, updateDto: UpdateEstadoSolicitudDto, usuarioAccion: Usuario): Promise<Solicitud> {
    const { id_nuevo_estado, comentario } = updateDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const solicitud = await queryRunner.manager.findOne(Solicitud, {
        where: { id_solicitud: id },
        relations: ['aprobadores'],
      });

      if (!solicitud) throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);

      const esAprobador = solicitud.aprobadores.some(a => a.id_usuario === usuarioAccion.id_usuario);
      if (!esAprobador) {
        throw new UnauthorizedException('No tienes permiso para aprobar o rechazar esta solicitud.');
      }

      const nuevoEstado = await queryRunner.manager.findOneBy(EstadoSolicitud, { id_estado: id_nuevo_estado });
      if (!nuevoEstado) throw new NotFoundException(`Estado con ID ${id_nuevo_estado} no encontrado.`);

      solicitud.estadoActual = nuevoEstado;
      await queryRunner.manager.save(solicitud);

      const nuevoHistorial = new HistorialSolicitud();
      nuevoHistorial.solicitud = solicitud;
      nuevoHistorial.estado = nuevoEstado;
      nuevoHistorial.comentario = comentario;
      nuevoHistorial.usuarioAccion = usuarioAccion;
      await queryRunner.manager.save(nuevoHistorial);

      await queryRunner.commitTransaction();
      return this.findOneWithDetails(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAssignedToAprobador(aprobadorId: number): Promise<Solicitud[]> {
    return this.solicitudRepository
      .createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.solicitante', 'solicitante')
      .leftJoinAndSelect('solicitud.estadoActual', 'estadoActual')
      .leftJoinAndSelect('solicitud.tipo', 'tipo')
      .innerJoin('solicitud.aprobadores', 'aprobador', 'aprobador.id_usuario = :aprobadorId', { aprobadorId })
      .orderBy('solicitud.fecha_creacion', 'DESC')
      .getMany();
  }
}