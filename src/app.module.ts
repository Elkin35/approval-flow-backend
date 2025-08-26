//approval_flow_backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { SeedingModule } from './database/seeding/seeding.module';
import { TiposSolicitudModule } from './tipos-solicitud/tipos-solicitud.module';
import { HistorialModule } from './historial/historial.module';
import { MailModule } from './mail/mail.module'; // <-- IMPORTADO

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    SolicitudesModule,
    SeedingModule,
    TiposSolicitudModule,
    HistorialModule,
    MailModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}