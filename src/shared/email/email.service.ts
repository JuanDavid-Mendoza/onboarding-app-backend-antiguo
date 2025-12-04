import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export class EmailService {
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      await sgMail.send(emailData);
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);

      if (error.response) {
        console.error('SendGrid Error Details:');
        console.error('Status Code:', error.code);
        console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
        console.error('Headers:', error.response.headers);
      }

      return false;
    }
  }

  static async sendOnboardingAssignmentEmail(
    toEmail: string,
    toName: string,
    fromEmail: string,
    fromName: string,
    onboardingName: string,
    onboardingDescription: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      to: toEmail,
      from: fromEmail,
      subject: `Asignación de Onboarding - ${onboardingName}`,
      text: `Estimado/a ${toName},\n\nSe le ha asignado el siguiente programa de onboarding: ${onboardingName}.\n\nDescripción: ${onboardingDescription}\n\nResponsable: ${fromName}\n\nCordialmente,\nBanco de Bogotá`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Asignación de Onboarding</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #003473 0%, #003473 70%, #EBB932 70%, #EBB932 85%, #CD3232 85%, #CD3232 100%); padding: 30px 40px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                        
                        </tr>
                      </table>
                    </td>
                  </tr>
                  

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #003473; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Asignación de Programa de Onboarding</h2>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Estimado/a <strong style="color: #003473;">${toName}</strong>,
                      </p>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                        Nos complace informarle que se le ha asignado el siguiente programa de onboarding para su desarrollo profesional en nuestra organización:
                      </p>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #003473 0%, #004d99 100%); border-radius: 8px; margin: 0 0 25px 0; overflow: hidden;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #EBB932; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">${onboardingName}</h3>
                            <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0;">${onboardingDescription}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 4px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Responsable de la asignación:</p>
                            <p style="color: #003473; font-size: 15px; margin: 0; font-weight: 600;">${fromName}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                        Le invitamos a acceder a su panel de usuario para revisar los detalles del programa, los recursos disponibles y comenzar su proceso de formación.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #003473 0%, #004d99 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 6px rgba(0,52,115,0.3);">Acceder al Panel</a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #003473; padding: 30px 40px; text-align: center;">
                      <p style="color: #EBB932; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Banco de Bogotá</p>
                      <p style="color: #ffffff; font-size: 13px; line-height: 1.6; margin: 0;">Comprometidos con su crecimiento profesional</p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(235, 185, 50, 0.3);">
                        <p style="color: #cccccc; font-size: 12px; line-height: 1.5; margin: 0;">
                          Este es un correo electrónico automático, por favor no responder.<br>
                          Si tiene alguna consulta, contacte con su supervisor directo.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    return this.sendEmail(emailData);
  }

  static async sendOnboardingUpdateEmail(
    toEmail: string,
    toName: string,
    fromEmail: string,
    fromName: string,
    onboardingName: string,
    onboardingDescription: string,
    newState: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      to: toEmail,
      from: fromEmail,
      subject: `Actualización de Onboarding - ${onboardingName}`,
      text: `Estimado/a ${toName},\n\nSe ha actualizado el estado de su programa de onboarding: ${onboardingName}.\n\nNuevo estado: ${newState}\n\nResponsable: ${fromName}\n\nCordialmente,\nBanco de Bogotá`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Actualización de Onboarding</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #003473 0%, #003473 70%, #EBB932 70%, #EBB932 85%, #CD3232 85%, #CD3232 100%); padding: 30px 40px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                        
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #003473; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Actualización de Programa de Onboarding</h2>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Estimado/a <strong style="color: #003473;">${toName}</strong>,
                      </p>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                        Le informamos que se ha actualizado el estado de su programa de onboarding:
                      </p>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #003473 0%, #004d99 100%); border-radius: 8px; margin: 0 0 25px 0; overflow: hidden;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #EBB932; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">${onboardingName}</h3>
                            <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">${onboardingDescription}</p>
                            <div style="background-color: rgba(235, 185, 50, 0.2); padding: 12px; border-radius: 4px; border-left: 3px solid #EBB932;">
                              <p style="color: #EBB932; font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Nuevo Estado:</p>
                              <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 600;">${newState}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 4px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Responsable de la actualización:</p>
                            <p style="color: #003473; font-size: 15px; margin: 0; font-weight: 600;">${fromName}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                        Puede acceder a su panel de usuario para revisar los detalles actualizados del programa.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #003473 0%, #004d99 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 6px rgba(0,52,115,0.3);">Acceder al Panel</a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #003473; padding: 30px 40px; text-align: center;">
                      <p style="color: #EBB932; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Banco de Bogotá</p>
                      <p style="color: #ffffff; font-size: 13px; line-height: 1.6; margin: 0;">Comprometidos con su crecimiento profesional</p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(235, 185, 50, 0.3);">
                        <p style="color: #cccccc; font-size: 12px; line-height: 1.5; margin: 0;">
                          Este es un correo electrónico automático, por favor no responder.<br>
                          Si tiene alguna consulta, contacte con su supervisor directo.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    return this.sendEmail(emailData);
  }

  static async sendOnboardingRemovalEmail(
    toEmail: string,
    toName: string,
    fromEmail: string,
    fromName: string,
    onboardingName: string,
    onboardingDescription: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      to: toEmail,
      from: fromEmail,
      subject: `Cancelación de Onboarding - ${onboardingName}`,
      text: `Estimado/a ${toName},\n\nSe ha removido su asignación del programa de onboarding: ${onboardingName}.\n\nResponsable: ${fromName}\n\nCordialmente,\nBanco de Bogotá`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cancelación de Onboarding</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #003473 0%, #003473 70%, #EBB932 70%, #EBB932 85%, #CD3232 85%, #CD3232 100%); padding: 30px 40px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                        
                        </tr>
                      </table>
                    </td>
                  </tr>
                  

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #CD3232; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Cancelación de onboarding</h2>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Estimado/a <strong style="color: #003473;">${toName}</strong>,
                      </p>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                        Le informamos que se ha removido su asignación del siguiente programa de onboarding:
                      </p>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #CD3232 0%, #a32828 100%); border-radius: 8px; margin: 0 0 25px 0; overflow: hidden;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #ffffff; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">${onboardingName}</h3>
                            <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0; opacity: 0.9;">${onboardingDescription}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 4px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Responsable de la remoción:</p>
                            <p style="color: #003473; font-size: 15px; margin: 0; font-weight: 600;">${fromName}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                        Si tiene alguna pregunta sobre esta remoción, por favor contacte con su supervisor directo o con el área de Recursos Humanos.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #003473 0%, #004d99 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 6px rgba(0,52,115,0.3);">Acceder al Panel</a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #003473; padding: 30px 40px; text-align: center;">
                      <p style="color: #EBB932; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Banco de Bogotá</p>
                      <p style="color: #ffffff; font-size: 13px; line-height: 1.6; margin: 0;">Comprometidos con su crecimiento profesional</p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(235, 185, 50, 0.3);">
                        <p style="color: #cccccc; font-size: 12px; line-height: 1.5; margin: 0;">
                          Este es un correo electrónico automático, por favor no responder.<br>
                          Si tiene alguna consulta, contacte con su supervisor directo.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    return this.sendEmail(emailData);
  }

  static async sendOnboardingModificationEmail(
    toEmail: string,
    toName: string,
    fromEmail: string,
    fromName: string,
    onboardingName: string,
    onboardingDescription: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      to: toEmail,
      from: fromEmail,
      subject: `Modificación de Onboarding - ${onboardingName}`,
      text: `Estimado/a ${toName},\n\nSe ha modificado el programa de onboarding: ${onboardingName}.\n\nDescripción actualizada: ${onboardingDescription}\n\nResponsable: ${fromName}\n\nCordialmente,\nBanco de Bogotá`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Modificación de Onboarding</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #003473 0%, #003473 70%, #EBB932 70%, #EBB932 85%, #CD3232 85%, #CD3232 100%); padding: 30px 40px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                        
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #EBB932; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Modificación de onboarding</h2>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Estimado/a <strong style="color: #003473;">${toName}</strong>,
                      </p>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                        Le informamos que se han realizado modificaciones en el programa de onboarding al que está asignado:
                      </p>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #EBB932 0%, #d4a32b 100%); border-radius: 8px; margin: 0 0 25px 0; overflow: hidden;">
                        <tr>
                          <td style="padding: 25px;">
                            <h3 style="color: #003473; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">${onboardingName}</h3>
                            <p style="color: #003473; font-size: 15px; line-height: 1.6; margin: 0;">${onboardingDescription}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff8e6; border-left: 4px solid #EBB932; border-radius: 4px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">⚠️ Importante:</p>
                            <p style="color: #555555; font-size: 14px; margin: 0;">Los cambios realizados pueden afectar el contenido, los recursos o las actividades del programa. Le recomendamos revisar la información actualizada.</p>
                          </td>
                        </tr>
                      </table>
                      
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 4px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Responsable de la modificación:</p>
                            <p style="color: #003473; font-size: 15px; margin: 0; font-weight: 600;">${fromName}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                        Acceda a su panel de usuario para revisar los detalles actualizados del programa y continuar con su proceso de formación.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #003473 0%, #004d99 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 6px rgba(0,52,115,0.3);">Acceder al Panel</a>
                      </div>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="background-color: #003473; padding: 30px 40px; text-align: center;">
                      <p style="color: #EBB932; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Banco de Bogotá</p>
                      <p style="color: #ffffff; font-size: 13px; line-height: 1.6; margin: 0;">Comprometidos con su crecimiento profesional</p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(235, 185, 50, 0.3);">
                        <p style="color: #cccccc; font-size: 12px; line-height: 1.5; margin: 0;">
                          Este es un correo electrónico automático, por favor no responder.<br>
                          Si tiene alguna consulta, contacte con su supervisor directo.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    return this.sendEmail(emailData);
  }
}
