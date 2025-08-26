// approval_flow_backend/src/database/entities/estado-solicitud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'estados_solicitud', schema: 'flujo_aprobacion' })
export class EstadoSolicitud {
  @PrimaryGeneratedColumn()
  id_estado: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nombre: string;
}