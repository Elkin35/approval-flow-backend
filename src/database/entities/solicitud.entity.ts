// approval_flow_backend/src/database/entities/solicitud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { TipoSolicitud } from './tipo-solicitud.entity';
import { EstadoSolicitud } from './estado-solicitud.entity';
import { HistorialSolicitud } from './historial-solicitud.entity';

@Entity({ name: 'solicitudes', schema: 'flujo_aprobacion' })
export class Solicitud {
  @PrimaryGeneratedColumn('uuid')
  id_solicitud: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_solicitante' })
  solicitante: Usuario;

  @ManyToOne(() => TipoSolicitud, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_tipo' })
  tipo: TipoSolicitud;

  @ManyToOne(() => EstadoSolicitud, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_estado_actual' })
  estadoActual: EstadoSolicitud;
  
  @ManyToMany(() => Usuario, { eager: true })
  @JoinTable({
    name: 'solicitud_aprobadores',
    schema: 'flujo_aprobacion',
    joinColumn: { name: 'id_solicitud', referencedColumnName: 'id_solicitud' },
    inverseJoinColumn: { name: 'id_aprobador', referencedColumnName: 'id_usuario' }
  })
  aprobadores: Usuario[];

  @OneToMany(() => HistorialSolicitud, (historial) => historial.solicitud)
  historial: HistorialSolicitud[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}