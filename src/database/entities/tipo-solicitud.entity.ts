// approval_flow_backend/src/database/entities/tipo-solicitud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipos_solicitud', schema: 'flujo_aprobacion' })
export class TipoSolicitud {
  @PrimaryGeneratedColumn()
  id_tipo: number;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: false,
    unique: true
  })
  nombre: string;
}