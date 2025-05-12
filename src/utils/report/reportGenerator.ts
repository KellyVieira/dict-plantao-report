
import { ReportData } from "../../types/report";
import { formatDate } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import { 
  getOccurrencesTable, 
  getImagesHTML, 
  getSignatureBlocks,
  getGeneralDataTable,
  getInstitutionalHeader,
  getDocumentFooter
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
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
        
        body {
          font-family: 'Times New Roman', Times, serif;
          line-height: 1.5;
          color: #333;
          margin: 0;
          padding: 20px;
          border: 1px solid #D3D3D3;
        }
        
        .page {
          padding: 30px 20px 25px 30px; /* Margins: Top, Right, Bottom, Left */
        }
        
        h1 {
          color: #000;
          text-align: center;
          font-size: 14pt;
          font-weight: bold;
          margin-top: 12pt;
          margin-bottom: 6pt;
          line-height: 1.0;
        }
        
        h2 {
          color: #000;
          font-size: 12pt;
          font-weight: bold;
          margin-top: 12pt;
          margin-bottom: 6pt;
          line-height: 1.0;
        }
        
        .date {
          text-align: center;
          margin-bottom: 24pt;
          font-style: italic;
          font-size: 12pt;
        }
        
        .section {
          margin-bottom: 24pt;
        }
        
        p {
          margin: 6pt 0;
          font-size: 12pt;
          text-align: justify;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        .signature-block {
          margin-top: 40px;
          text-align: center;
        }
        
        .signature-line {
          width: 200px;
          border-top: 1px solid #000;
          margin: 0 auto;
        }
        
        .signature-name {
          margin: 5px 0;
        }
        
        .preview-border {
          border: 1px solid #D3D3D3;
          padding: 30px 20px 25px 30px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="preview-border">
        ${getInstitutionalHeader()}
        
        <h1>RELATÓRIO DE PLANTÃO ${reportData.reportNumber || ""}</h1>
        <p class="date">${formatDate(reportData.reportDate)}</p>
        
        <div class="section">
          <p style="line-height: 1.5;">${getIntroductoryText(reportData)}</p>
        </div>
        
        <div class="section">
          ${getGeneralDataTable(reportData)}
        </div>
        
        <div class="section">
          <h2>1. Resumo das Ocorrências</h2>
          ${reportData.hasOccurrences 
            ? getOccurrencesTable(reportData.occurrences)
            : "<p><em>Não houve ocorrências durante o plantão.</em></p>"
          }
        </div>
        
        <div class="section">
          <h2>2. Imagens Relevantes</h2>
          ${getImagesHTML(reportData)}
        </div>
        
        <div class="section">
          <h2>3. Observações e Recomendações</h2>
          <p>${getObservationsText(reportData.observations)}</p>
        </div>
        
        <div class="section">
          <h2>4. Conclusão</h2>
          <p>Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos.</p>
        </div>
        
        <div class="section">
          <h2>Assinaturas</h2>
          ${getSignatureBlocks(reportData)}
        </div>
        
        ${getDocumentFooter()}
      </div>
    </body>
    </html>
  `;
}
