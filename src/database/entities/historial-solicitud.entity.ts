// approval_flow_backend/src/database/entities/historial-solicitud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { EstadoSolicitud } from './estado-solicitud.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'historial_solicitudes', schema: 'flujo_aprobacion' })
export class HistorialSolicitud {
  @PrimaryGeneratedColumn()
  id_historial: number;

  @ManyToOne(() => Solicitud, (solicitud) => solicitud.historial, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_solicitud' })
  solicitud: Solicitud;

  @ManyToOne(() => EstadoSolicitud, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado: EstadoSolicitud;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'id_usuario_accion' })
  usuarioAccion: Usuario;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_cambio: Date;
}