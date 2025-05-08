
import { ReportData } from "../../types/report";
import { formatDate } from "./dateFormatters";
import { 
  getIntroductoryText, 
  getObservationsText 
} from "./textGenerators";
import { 
  getOccurrencesTable, 
  getImagesHTML, 
  getSignatureBlocks 
} from "./htmlGenerators";

export function generateFullReportHTML(reportData: ReportData): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Plantão - ${reportData.reportNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        h1, h2 {
          color: #1a3a6e;
        }
        h1 {
          text-align: center;
          margin-bottom: 5px;
        }
        .date {
          text-align: center;
          margin-bottom: 20px;
          font-style: italic;
        }
        .section {
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .signature-space {
          margin-top: 40px;
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        .general-info {
          margin-bottom: 20px;
        }
        .general-info p {
          margin: 5px 0;
        }
        .general-info strong {
          font-weight: bold;
        }
        img {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <h1>Relatório de Plantão</h1>
      <p class="date">${formatDate(reportData.reportDate)}</p>
      
      <div class="section">
        ${getIntroductoryText(reportData)}
      </div>
      
      <div class="section">
        <h2>Dados Gerais</h2>
        <div class="general-info">
          <p><strong>Nome da equipe:</strong> ${reportData.teamName}</p>
          <p><strong>Cartório responsável:</strong> ${reportData.responsibleOffice}</p>
          <p><strong>Policiais da equipe:</strong></p>
          <ul>
            ${reportData.officers.map(officer => `<li>${officer.name} - ${officer.role}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="section">
        <h2>Resumo das Ocorrências</h2>
        ${reportData.hasOccurrences 
          ? getOccurrencesTable(reportData.occurrences)
          : "<p><em>Não houve ocorrências durante o plantão.</em></p>"
        }
      </div>
      
      <div class="section">
        <h2>Imagens Relevantes</h2>
        ${getImagesHTML(reportData)}
      </div>
      
      <div class="section">
        <h2>Observações e Recomendações</h2>
        <p>${getObservationsText(reportData.observations)}</p>
      </div>
      
      <div class="section">
        <h2>Conclusão</h2>
        <p>Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos.</p>
      </div>
      
      <div class="section">
        <h2>Assinaturas</h2>
        ${getSignatureBlocks(reportData)}
      </div>
    </body>
    </html>
  `;
}
