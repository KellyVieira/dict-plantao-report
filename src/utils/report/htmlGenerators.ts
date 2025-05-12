import { Occurrence, ReportData } from "../../types/report";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";

export function getOccurrencesTable(occurrences: Occurrence[]): string {
  if (!occurrences.length) return "";

  let htmlContent = '';
  
  occurrences.forEach(occurrence => {
    htmlContent += `
    <table border="0" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Número do RAI</td>
        <td style="background-color: #f9f9f9; width: 70%;">${occurrence.raiNumber}</td>
      </tr>
      <tr>
        <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Natureza da Ocorrência</td>
        <td style="background-color: #f9f9f9; width: 70%;">${occurrence.nature}</td>
      </tr>
      <tr>
        <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Resumo da Ocorrência</td>
        <td style="background-color: #f9f9f9; width: 70%;">${occurrence.summary}</td>
      </tr>
      <tr>
        <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Cartório Responsável</td>
        <td style="background-color: #f9f9f9; width: 70%;">${occurrence.responsibleOffice}</td>
      </tr>
    </table>
    `;
  });
  
  return htmlContent;
}

export function getImagesHTML(reportData: ReportData): string {
  if (!reportData.images.length) {
    return "<p style='font-family: \"Times New Roman\", Times, serif; font-style: italic;'>Sem imagens relevantes</p>";
  }
  
  return reportData.images.map((image, index) => `
    <table border="0" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="text-align: center;">
          <img src="${image.dataUrl}" alt="Imagem ${index + 1}" style="max-width: 100%; max-height: 300px;" />
        </td>
      </tr>
      <tr>
        <td style="text-align: center; font-style: italic; font-family: \"Times New Roman\", Times, serif;">
          ${image.description || `Imagem ${index + 1}`}
        </td>
      </tr>
    </table>
  `).join('');
}

export function getGeneralDataTable(reportData: ReportData): string {
  return `
  <table border="0" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Início do Plantão</td>
      <td style="background-color: #f9f9f9; width: 70%;">${formatDateTime(reportData.startDateTime)}</td>
    </tr>
    <tr>
      <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Fim do Plantão</td>
      <td style="background-color: #f9f9f9; width: 70%;">${formatDateTime(reportData.endDateTime)}</td>
    </tr>
    <tr>
      <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Nome da Equipe</td>
      <td style="background-color: #f9f9f9; width: 70%;">${reportData.teamName}</td>
    </tr>
    <tr>
      <td style="background-color: #f2f2f2; font-weight: bold; width: 30%;">Cartório Responsável</td>
      <td style="background-color: #f9f9f9; width: 70%;">${reportData.responsibleOffice}</td>
    </tr>
  </table>
  
  <table border="0" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="background-color: #f2f2f2; font-weight: bold; width: 30%; vertical-align: top;">Policiais da Equipe</td>
      <td style="background-color: #f9f9f9; width: 70%;">
        ${reportData.officers.map(officer => `${officer.name} - ${officer.role}`).join('<br>')}
      </td>
    </tr>
  </table>
  `;
}

export function getSignatureBlocks(reportData: ReportData): string {
  return reportData.officers.map(officer => `
    <div style="margin-top: 30px; text-align: center;">
      <div style="width: 200px; margin: 0 auto;">
        <div style="width: 100%; border-top: 1px solid black;"></div>
        <p style="margin: 5px 0; font-family: 'Times New Roman', Times, serif;">${officer.name} - ${officer.role}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Generate the institutional header HTML
 */
export const getInstitutionalHeader = (): string => {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24pt;">
      <div style="width: 15%; text-align: center;">
        <img src="/lovable-uploads/81c65d63-622f-4659-9e6e-325660565994.png" alt="Brasão de Goiás" style="width: 65px; height: 65px;" />
      </div>
      <div style="width: 70%; text-align: center;">
        <p style="margin: 0; font-weight: bold; font-size: 10pt;">ESTADO DE GOIÁS</p>
        <p style="margin: 0; font-weight: bold; font-size: 10pt;">SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA</p>
        <p style="margin: 0; font-weight: bold; font-size: 10pt;">POLÍCIA CIVIL</p>
        <p style="margin: 0; font-weight: bold; font-size: 10pt;">DELEGACIA ESPECIALIZADA EM INVESTIGAÇÕES DE CRIMES DE</p>
        <p style="margin: 0; font-weight: bold; font-size: 10pt;">TRÂNSITO - DICT DE GOIÂNIA</p>
      </div>
      <div style="width: 15%; text-align: center;">
        <img src="/lovable-uploads/40f0ded4-d89b-4ec7-847e-a35119ee6181.png" alt="Brasão da Polícia Civil" style="width: 65px; height: 65px;" />
      </div>
    </div>
  `;
};

export function getDocumentFooter(): string {
  return `
  <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
    <p style="color: #FF0000; font-weight: bold; font-family: 'Times New Roman', Times, serif; font-size: 8pt;">DOCUMENTO RESERVADO - DICT</p>
  </div>
  `;
