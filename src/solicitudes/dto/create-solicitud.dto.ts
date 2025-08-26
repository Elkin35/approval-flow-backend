//approval_flow_backend/src/solicitudes/dto/create-solicitud.dto.ts
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  id_tipo: number;

  @IsNumber()
  @IsNotEmpty()
  id_aprobador: number;
}