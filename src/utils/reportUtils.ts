
import { ReportData, Occurrence } from "../contexts/ReportContext";

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return "";
  try {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString('pt-BR')} às ${dateTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateTimeString;
  }
}

export function getIntroductoryText(reportData: ReportData): string {
  return `Trata-se do relatório de plantão de número ${reportData.reportNumber}, referente à jornada plantonista que se iniciou no dia ${formatDateTime(reportData.startDateTime)} e finalizou-se no dia ${formatDateTime(reportData.endDateTime)}.

O presente documento tem por finalidade registrar, de forma clara e sucinta, os principais atendimentos, ocorrências, procedimentos instaurados e providências adotadas durante o referido período de plantão na Delegacia Especializada em Investigações de Crimes de Trânsito - DICT.

Busca-se, com isso, sobrelevar as diligências preliminares realizadas em local de acidente de trânsito com vítima, assegurar a continuidade dos trabalhos investigativos, a rastreabilidade das ações empreendidas e a adequada comunicação entre as equipes que se sucedem, em conformidade com os princípios da legalidade, eficiência e transparência que regem a Administração Pública.`;
}

export function getOccurrencesTable(occurrences: Occurrence[]): string {
  if (!occurrences.length) return "";

  const tableHeader = `
  <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th>Número do RAI</th>
        <th>Natureza da Ocorrência</th>
        <th>Resumo da Ocorrência</th>
        <th>Cartório Responsável</th>
      </tr>
    </thead>
    <tbody>
  `;
  
  const tableRows = occurrences.map(occurrence => `
    <tr>
      <td>${occurrence.raiNumber}</td>
      <td>${occurrence.nature}</td>
      <td>${occurrence.summary}</td>
      <td>${occurrence.responsibleOffice}</td>
    </tr>
  `).join('');
  
  const tableFooter = `
    </tbody>
  </table>
  `;
  
  return tableHeader + tableRows + tableFooter;
}

export function getImagesHTML(reportData: ReportData): string {
  if (!reportData.images.length) {
    return "<p><em>Sem imagens relevantes</em></p>";
  }
  
  return reportData.images.map((image, index) => `
    <div style="margin-bottom: 20px;">
      <img src="${image.dataUrl}" alt="Imagem ${index + 1}" style="max-width: 100%; max-height: 300px; margin-bottom: 8px;" />
      <p style="font-style: italic;">${image.description || `Imagem ${index + 1}`}</p>
    </div>
  `).join('');
}

export function getObservationsText(observations: string): string {
  return observations.trim() || 
    "Não há informações dignas de nota decorrentes do Plantão ora documentado.";
}

export function getSignatureBlocks(reportData: ReportData): string {
  return reportData.officers.map(officer => `
    <div style="margin-top: 30px;">
      <div style="width: 100%; border-top: 1px solid black;"></div>
      <p style="margin: 5px 0;">${officer.name} - ${officer.role}</p>
    </div>
  `).join('');
}

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
