//approval_flow_backend/src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Solicitud } from 'src/database/entities/solicitud.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNewRequestNotification(solicitud: Solicitud) {
    const aprobador = solicitud.aprobadores[0]; // Ahora solo hay uno
    const solicitante = solicitud.solicitante;
    const url = `http://localhost:3000/request/${solicitud.id_solicitud}`; // Cambia localhost:3000 por la URL de tu frontend

    await this.mailerService.sendMail({
      to: aprobador.email,
      subject: `Nueva solicitud de aprobación: "${solicitud.titulo}"`,
      html: `
        <h1>Nueva Solicitud Pendiente</h1>
        <p>Hola ${aprobador.nombre},</p>
        <p>El usuario <strong>${solicitante.nombre}</strong> ha creado una nueva solicitud que requiere tu aprobación.</p>
        
        <h2>Detalles de la Solicitud:</h2>
        <ul>
          <li><strong>Título:</strong> ${solicitud.titulo}</li>
          <li><strong>Descripción:</strong> ${solicitud.descripcion}</li>
          <li><strong>Tipo:</strong> ${solicitud.tipo.nombre}</li>
        </ul>
        
        <p>Puedes revisar y gestionar la solicitud haciendo clic en el siguiente enlace:</p>
        <a href="${url}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Ver Solicitud
        </a>
        
        <p>Gracias,</p>
        <p>El equipo de ApprovalFlow</p>
      `,
    });
  }
}