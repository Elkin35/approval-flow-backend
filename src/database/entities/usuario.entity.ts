// approval_flow_backend/src/database/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Rol } from './rol.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'usuarios', schema: 'flujo_aprobacion' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password_hash?: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @BeforeInsert()
  hashPassword() {
    if (this.password_hash) {
      this.password_hash = bcrypt.hashSync(this.password_hash, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password_hash) {
      return false;
    }
    return await bcrypt.compare(password, this.password_hash);
  }
}