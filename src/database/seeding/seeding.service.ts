// approval_flow_backend/src/database/seeding/seeding.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { EstadoSolicitud } from '../entities/estado-solicitud.entity';
import { TipoSolicitud } from '../entities/tipo-solicitud.entity';
import { Usuario } from '../entities/usuario.entity';
import { ROLES } from 'src/common/enums/roles.enum';
import { ESTADOS_SOLICITUD } from 'src/common/enums/estados-solicitud.enum';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(EstadoSolicitud)
    private readonly estadoRepository: Repository<EstadoSolicitud>,
    @InjectRepository(TipoSolicitud)
    private readonly tipoRepository: Repository<TipoSolicitud>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    
  }

  async seed() {
    await this.seedRoles();
    await this.seedEstados();
    await this.seedTipos();
    await this.seedUsuarios();
  }

  private async seedRoles() {
    const roles = Object.values(ROLES);
    for (const nombre of roles) {
      const exists = await this.rolRepository.findOneBy({ nombre });
      if (!exists) {
        await this.rolRepository.save({ nombre });
      }
    }
  }

  private async seedEstados() {
    const estados = Object.values(ESTADOS_SOLICITUD);
    for (const nombre of estados) {
      const exists = await this.estadoRepository.findOneBy({ nombre });
      if (!exists) {
        await this.estadoRepository.save({ nombre });
      }
    }
  }

  private async seedTipos() {
    const tipos = ['Despliegue', 'Acceso a Herramientas', 'Cambio Técnico', 'Incorporación'];
    for (const nombre of tipos) {
      const exists = await this.tipoRepository.findOneBy({ nombre });
      if (!exists) {
        await this.tipoRepository.save({ nombre });
      }
    }
  }

  private async seedUsuarios() {
    // Usar los roles actuales: ADMIN y STANDARD
    const adminRole = await this.rolRepository.findOneBy({ nombre: ROLES.ADMIN });
    const standardRole = await this.rolRepository.findOneBy({ nombre: ROLES.STANDARD });

    const usuarios = [
      {
        nombre: 'Usuario Administrador',
        email: 'admin@test.com',
        username: 'admin1',
        password_hash: 'Password123!', // La entidad se encargará de hashearla
        rol: adminRole ?? undefined,
      },
      {
        nombre: 'Usuario Estándar',
        email: 'standard@test.com',
        username: 'standard1',
        password_hash: 'Password123!',
        rol: standardRole ?? undefined,
      },
    ];

    for (const userData of usuarios) {
      const exists = await this.usuarioRepository.findOneBy({ username: userData.username });
      if (!exists) {
        const user = this.usuarioRepository.create(userData);
        await this.usuarioRepository.save(user);
      }
    }
    console.log('Seeding completed.');
  }
}