import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Exporta o relatório para PDF usando uma abordagem baseada em html2canvas
 * para garantir que a aparência fique igual à visualização prévia
 */
export async function exportReportToPdf(reportData: ReportData): Promise<void> {
  try {
    // Nome do arquivo
    const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.pdf`;
    
    // Mostrar mensagem de preparação
    toast.info("Preparando exportação para PDF...");
    
    // Gerar o HTML do relatório
    const reportHtml = generatePrintableReportHTML(reportData);
    
    // Criar elemento temporário no DOM
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = reportHtml;
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm"; // Largura A4
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.padding = "20mm";
    document.body.appendChild(tempContainer);
    
    // Esperar por imagens para carregar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Criar instância de PDF com orientação retrato e tamanho A4
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });
    
    // Função para adicionar cabeçalho específico para cada página
    const addHeader = (pageNumber: number) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("POLÍCIA CIVIL DO ESTADO DE GOIÁS", 105, 10, { align: "center" });
      pdf.text("DELEGACIA ESPECIALIZADA EM INVESTIGAÇÃO DE CRIMES DE TRÂNSITO", 105, 15, { align: "center" });
      
      // Adicionar número de página
      pdf.text(`Página ${pageNumber}`, 190, 10, { align: "right" });
      
      // Linha horizontal do cabeçalho
      pdf.setLineWidth(0.1);
      pdf.line(10, 17, 200, 17);
    };
    
    // Converter o HTML para uma série de imagens de canvas e adicionar ao PDF
    const renderPage = async (element: HTMLElement, pageNumber = 1) => {
      try {
        // Renderizar a página como canvas
        const canvas = await html2canvas(element, {
          scale: 2, // Maior qualidade
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "white"
        });
        
        // Converter canvas para imagem
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        
        // Se não for a primeira página, adicionar nova página
        if (pageNumber > 1) {
          pdf.addPage();
        }
        
        // Adicionar cabeçalho
        addHeader(pageNumber);
        
        // Adicionar imagem do canvas ao PDF
        // Ajustar para começar abaixo do cabeçalho e com margens
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // margens em mm
        const headerHeight = 20; // altura do cabeçalho em mm
        
        // Ajustar a altura da imagem preservando a proporção
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Adicionar imagem ao PDF
        pdf.addImage(
          imgData, 
          "JPEG", 
          margin, 
          headerHeight, 
          imgWidth, 
          imgHeight
        );
        
        return { height: imgHeight + headerHeight, pageNumber };
      } catch (error) {
        console.error("Erro ao renderizar página:", error);
        throw error;
      }
    };
    
    // Dividir o conteúdo em seções para renderizar separadamente
    const sections = tempContainer.querySelectorAll(".report-section");
    
    if (sections.length === 0) {
      // Se não houver seções definidas, renderizar tudo de uma vez
      await renderPage(tempContainer);
    } else {
      // Renderizar cada seção como uma página separada
      let pageNumber = 1;
      for (const section of Array.from(sections)) {
        await renderPage(section as HTMLElement, pageNumber);
        pageNumber++;
      }
    }
    
    // Limpar elemento temporário
    document.body.removeChild(tempContainer);
    
    // Salvar o PDF
    pdf.save(fileName);
    
    // Mostrar mensagem de sucesso
    toast.success("Relatório exportado com sucesso como PDF");
  } catch (error) {
    console.error("Erro na exportação para PDF:", error);
    toast.error("Erro ao exportar o relatório como PDF. Tente novamente.");
  }
}

/**
 * Gera o HTML completo do relatório otimizado para impressão em PDF
 */
function generatePrintableReportHTML(reportData: ReportData): string {
  // Usar a mesma estrutura do HTML de visualização, mas dividir em seções para paginação
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
          padding: 0;
        }
        
        .report-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
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
        
        p {
          margin: 6pt 0;
          font-size: 12pt;
          text-align: justify;
        }
        
        .intro-paragraph {
          text-indent: 2cm;
        }
        
        .observation-paragraph {
          text-indent: 2cm;
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
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .center-section {
          text-align: center;
          flex: 1;
        }
        
        .emblem {
          width: 65px;
          height: 65px;
          object-fit: contain;
        }
        
        .title-section {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        .data-table td {
          padding: 8px;
        }
        
        .data-table tr:nth-child(odd) td:first-child {
          background-color: #f2f2f2;
          font-weight: bold;
          width: 30%;
        }
        
        .data-table tr:nth-child(odd) td:last-child {
          background-color: #f9f9f9;
          width: 70%;
        }
        
        .image-container {
          margin: 20px 0;
          text-align: center;
        }
        
        .report-image {
          max-width: 100%;
          max-height: 300px;
          border: 1px solid #ddd;
        }
        
        .image-caption {
          margin-top: 5px;
          font-style: italic;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <!-- Cabeçalho institucional -->
      <div class="report-section header-section">
        <div>
          <img src="/lovable-uploads/40f0ded4-d89b-4ec7-847e-a35119ee6181.png" alt="Brasão da Polícia Civil" class="emblem" />
        </div>
        <div class="center-section">
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">ESTADO DE GOIÁS</p>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA</p>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">POLÍCIA CIVIL</p>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">DELEGACIA ESPECIALIZADA EM INVESTIGAÇÕES DE CRIMES DE</p>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">TRÂNSITO - DICT DE GOIÂNIA</p>
        </div>
        <div>
          <img src="/lovable-uploads/81c65d63-622f-4659-9e6e-325660565994.png" alt="Brasão de Goiás" class="emblem" />
        </div>
      </div>
      
      <!-- Título do relatório -->
      <div class="report-section title-section">
        <h1>RELATÓRIO DE PLANTÃO ${reportData.reportNumber || ""}</h1>
        <p class="date">${formatDate(reportData.reportDate)}</p>
      </div>
      
      <!-- Texto introdutório -->
      <div class="report-section">
        <p class="intro-paragraph">${getIntroductoryText(reportData)}</p>
      </div>
      
      <!-- Dados gerais -->
      <div class="report-section">
        <table class="data-table">
          <tr>
            <td>Início do Plantão</td>
            <td>${formatDateTime(reportData.startDateTime)}</td>
          </tr>
          <tr>
            <td>Fim do Plantão</td>
            <td>${formatDateTime(reportData.endDateTime)}</td>
          </tr>
          <tr>
            <td>Nome da Equipe</td>
            <td>${reportData.teamName}</td>
          </tr>
          <tr>
            <td>Cartório Responsável</td>
            <td>${reportData.responsibleOffice}</td>
          </tr>
        </table>
        
        <table class="data-table">
          <tr>
            <td>Policiais da Equipe</td>
            <td>
              <ul style="list-style-type: disc; margin: 0; padding-left: 20px;">
                ${reportData.officers.map(officer => `<li>${officer.name}<br>${officer.role}</li>`).join('')}
              </ul>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Seção de ocorrências -->
      <div class="report-section">
        <h2>1. Resumo das Ocorrências</h2>
        ${reportData.hasOccurrences && reportData.occurrences.length > 0 
          ? reportData.occurrences.map(occurrence => `
              <table class="data-table">
                <tr>
                  <td>Número do RAI</td>
                  <td>${occurrence.raiNumber}</td>
                </tr>
                <tr>
                  <td>Natureza da Ocorrência</td>
                  <td>${occurrence.nature}</td>
                </tr>
                <tr>
                  <td>Resumo da Ocorrência</td>
                  <td>${occurrence.summary}</td>
                </tr>
                <tr>
                  <td>Cartório Responsável</td>
                  <td>${occurrence.responsibleOffice}</td>
                </tr>
              </table>
            `).join('')
          : "<p style='font-style: italic;'>Não houve ocorrências durante o plantão.</p>"
        }
      </div>
      
      <!-- Seção de imagens -->
      <div class="report-section">
        <h2>2. Imagens Relevantes</h2>
        ${reportData.images && reportData.images.length > 0 
          ? reportData.images.map((image, index) => `
              <div class="image-container">
                <img src="${image.dataUrl}" alt="Imagem ${index + 1}" class="report-image" />
                <p class="image-caption">${image.description || `Imagem ${index + 1}`}</p>
              </div>
            `).join('')
          : "<p style='font-style: italic;'>Sem imagens relevantes</p>"
        }
      </div>
      
      <!-- Seção de observações -->
      <div class="report-section">
        <h2>3. Observações e Recomendações</h2>
        <p class="observation-paragraph">${getObservationsText(reportData.observations)}</p>
      </div>
      
      <!-- Seção de conclusão -->
      <div class="report-section">
        <h2>4. Conclusão</h2>
        <p class="observation-paragraph">Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos.</p>
      </div>
      
      <!-- Seção de assinaturas -->
      <div class="report-section">
        <h2>Assinaturas</h2>
        ${reportData.officers.map(officer => `
          <div class="signature-block">
            <div class="signature-line"></div>
            <p class="signature-name">${officer.name}<br>${officer.role}</p>
          </div>
        `).join('')}
      </div>
      
      <!-- Rodapé do documento -->
      <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
        <p style="color: #FF0000; font-weight: bold; font-size: 8pt;">DOCUMENTO RESERVADO - DICT</p>
      </div>
    </body>
    </html>
  `;
}