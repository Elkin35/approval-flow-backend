//approval_flow_backend/src/solicitudes/solicitudes.module.ts
import { Module } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from '../database/entities/solicitud.entity';
import { HistorialSolicitud } from '../database/entities/historial-solicitud.entity';
import { EstadoSolicitud } from '../database/entities/estado-solicitud.entity';
import { TipoSolicitud } from '../database/entities/tipo-solicitud.entity';
import { Usuario } from '../database/entities/usuario.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module'; // <-- IMPORTADO

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      HistorialSolicitud,
      EstadoSolicitud,
      TipoSolicitud,
      Usuario,
    ]),
    AuthModule,
    MailModule, 
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}