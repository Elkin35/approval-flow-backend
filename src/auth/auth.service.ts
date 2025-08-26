// approval_flow_backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../database/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await user.validatePassword(pass)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Usuario) {
    const payload = { 
      username: user.username, 
      sub: user.id_usuario,
      rol: user.rol.nombre
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}