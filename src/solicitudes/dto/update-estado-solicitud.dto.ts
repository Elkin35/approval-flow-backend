// approval_flow_backend/src/solicitudes/dto/update-estado-solicitud.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEstadoSolicitudDto {
  @IsNumber()
  @IsNotEmpty()
  id_nuevo_estado: number;

  @IsString()
  @IsOptional()
  comentario: string;
}