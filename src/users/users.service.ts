// approval_flow_backend/src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../database/entities/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Rol } from 'src/database/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
    @InjectRepository(Rol) 
    private rolesRepository: Repository<Rol>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const { nombre, email, username, password_hash, id_rol } = createUserDto;
    
    const existingUser = await this.usersRepository.findOne({ where: [{ email }, { username }]});
    if (existingUser) {
        throw new ConflictException('El email o nombre de usuario ya existe');
    }

    const rol = await this.rolesRepository.findOneBy({ id_rol });
    if (!rol) {
        throw new NotFoundException(`Rol con ID ${id_rol} no encontrado`);
    }

    const newUser = this.usersRepository.create({
        nombre,
        email,
        username,
        password_hash,
        rol
    });

    const savedUser = await this.usersRepository.save(newUser);
    delete savedUser.password_hash;
    return savedUser;
  }

  async findAll(): Promise<Omit<Usuario, 'password_hash'>[]> {
    const users = await this.usersRepository.find({ relations: ['rol'] });
    return users.map(u => {
      const instance = Object.assign(new Usuario(), u);

      delete instance.password_hash;
      return instance as Omit<Usuario, 'password_hash'>;
    });
  }

  async findOneByUsername(username: string): Promise<Usuario | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<Usuario | null> {
    return this.usersRepository.findOne({ where: { id_usuario: id } });
  }
}