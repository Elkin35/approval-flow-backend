// approval_flow_backend/src/main.ts
import { webcrypto } from 'crypto';
global.crypto = webcrypto as any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedingService } from './database/seeding/seeding.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors(
    {
      origin: frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // Ejecutar el seeder al iniciar la aplicación
  const seeder = app.get(SeedingService);
  await seeder.seed();

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();