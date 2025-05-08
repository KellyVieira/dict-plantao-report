
import { Occurrence, ReportData } from "../../types/report";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";

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

export function getSignatureBlocks(reportData: ReportData): string {
  return reportData.officers.map(officer => `
    <div style="margin-top: 30px;">
      <div style="width: 100%; border-top: 1px solid black;"></div>
      <p style="margin: 5px 0;">${officer.name} - ${officer.role}</p>
    </div>
  `).join('');
}
