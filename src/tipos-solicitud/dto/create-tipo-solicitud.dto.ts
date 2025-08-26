// approval_flow_backend/src/tipos-solicitud/dto/create-tipo-solicitud.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoSolicitudDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}