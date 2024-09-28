import { Injectable } from '@nestjs/common'

interface NewCheckInBodyParams {
  companyName: string
  customerFirstName: string
  checkInDetails: string
  weight: number
  storageURL: string
  attachmentsUrls: string[]
}

@Injectable()
export class CheckInEmailBodyTemplates {
  public newCheckInBody(data: NewCheckInBodyParams): string {
    const attachmentsHtml = data.attachmentsUrls
      .map(
        (url) =>
          `<div><img src="${url}" alt="Package image" style="max-width: 100%; height: auto; margin-bottom: 10px;"/></div>`,
      )
      .join('')

    return `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          
          <h2 style="color: #2d3748; text-align: center;">Encomenda Recebida!</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Olá <strong>${data.customerFirstName}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Informamos que ${data.companyName} recebeu seu pacote.
          </p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d3748;">Detalhes do Check-In:</h3>
            <p><strong>Descrição:</strong> ${data.checkInDetails || 'Não informado'}</p>
            <p><strong>Peso:</strong> ${(data.weight / 1000).toFixed(2)} kg</p>
          </div>
          
          <h3 style="color: #2d3748;">Imagens da Caixa:</h3>
          ${attachmentsHtml || '<p>Nenhuma imagem disponível.</p>'}
          
          <p style="font-size: 14px; line-height: 1.6;">
            Você pode acessar as informações completas do pacote clicando no link abaixo:
          </p>
          
          <p style="text-align: center;">
            <a href="${data.storageURL}" style="background-color: #4299e1; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Ver Detalhes
            </a>
          </p>
          
          <p style="font-size: 14px; color: #718096; text-align: center; margin-top: 20px;">
            Atenciosamente,<br>
            Equipe de Logística
          </p>
        </div>
      </div>
    `
  }
}
