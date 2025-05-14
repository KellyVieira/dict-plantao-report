import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "./dateFormatters";

/**
 * Exporta o relatório diretamente para PDF usando jsPDF
 * Abordagem mais simples e direta para evitar problemas no Vercel
 */
export async function exportReportToPdf(reportData: ReportData): Promise<void> {
  try {
    // Nome do arquivo
    const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.pdf`;
    
    // Importar jsPDF dinamicamente
    const jspdfModule = await import('jspdf');
    const jsPDF = jspdfModule.default;
    
    // Criar instância de PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Configurar fontes
    pdf.setFont("helvetica");
    
    // Adicionar cabeçalho
    pdf.setFontSize(16);
    pdf.text("POLÍCIA CIVIL DO ESTADO DE GOIÁS", 105, 20, { align: "center" });
    pdf.text("DELEGACIA DE INVESTIGAÇÃO DE CRIMES DE TRÂNSITO", 105, 28, { align: "center" });
    pdf.text("RELATÓRIO DE PLANTÃO", 105, 36, { align: "center" });
    
    // Adicionar linha horizontal
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(20, 40, 190, 40);
    
    // Informações do relatório
    pdf.setFontSize(12);
    pdf.text(`Relatório Nº: ${reportData.reportNumber || "N/A"}`, 20, 50);
    
    // Usar o nome do primeiro policial como oficial responsável se disponível
    const officerName = reportData.officers && reportData.officers.length > 0 
      ? reportData.officers[0].name 
      : "N/A";
      
    pdf.text(`Plantonista: ${officerName}`, 20, 58);
    pdf.text(`Data: ${formatDate(reportData.reportDate) || "N/A"}`, 20, 66);
    pdf.text(`Horário: ${formatDateTime(reportData.startDateTime) || "N/A"}`, 20, 74);
    
    // Título da seção de ocorrências
    pdf.setFontSize(14);
    pdf.text("OCORRÊNCIAS REGISTRADAS:", 20, 90);
    
    // Conteúdo das ocorrências
    pdf.setFontSize(12);
    
    let yPos = 100; // Posição inicial para ocorrências
    
    if (reportData.hasOccurrences && reportData.occurrences && reportData.occurrences.length > 0) {
      // Formatar texto de ocorrências
      let occurrencesText = '';
      
      reportData.occurrences.forEach((occurrence, index) => {
        occurrencesText += `RAI: ${occurrence.raiNumber}\n`;
        occurrencesText += `Natureza: ${occurrence.nature}\n`;
        occurrencesText += `Resumo: ${occurrence.summary}\n`;
        occurrencesText += `Cartório: ${occurrence.responsibleOffice}\n\n`;
      });
      
      // Quebrar texto longo em múltiplas linhas
      const splitText = pdf.splitTextToSize(occurrencesText, 170);
      
      // Verificar se precisamos de múltiplas páginas
      if (splitText.length > 30) {
        let currentPage = 1;
        let linesPerPage = 35;
        let totalPages = Math.ceil(splitText.length / linesPerPage);
        
        // Loop para adicionar páginas conforme necessário
        for (let i = 0; i < splitText.length; i += linesPerPage) {
          if (currentPage > 1) {
            pdf.addPage();
            pdf.text(`Página ${currentPage} de ${totalPages}`, 170, 10);
          }
          
          let pageText = splitText.slice(i, i + linesPerPage);
          pdf.text(pageText, 20, currentPage === 1 ? 100 : 20);
          currentPage++;
        }
      } else {
        pdf.text(splitText, 20, 100);
      }
    } else {
      pdf.text("Nenhuma ocorrência registrada.", 20, 100);
    }
    
    // Verificar se há observações
    if (reportData.observations && reportData.observations.trim()) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("OBSERVAÇÕES:", 20, 20);
      
      pdf.setFontSize(12);
      const notesText = reportData.observations.trim();
      const splitNotes = pdf.splitTextToSize(notesText, 170);
      pdf.text(splitNotes, 20, 30);
      
      yPos = pdf.internal.pageSize.height - 60;
    }
    
    // Tentar adicionar imagens se existirem
    if (reportData.images && reportData.images.length > 0) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("IMAGENS:", 20, 20);
      
      let imageY = 30;
      
      for (let i = 0; i < Math.min(reportData.images.length, 4); i++) { // Limitar a 4 imagens para simplificar
        try {
          const image = reportData.images[i];
          pdf.addImage(image.dataUrl, 'JPEG', 20, imageY, 160, 80);
          imageY += 90;
          
          if (imageY > 230 && i < reportData.images.length - 1) {
            pdf.addPage();
            imageY = 20;
          }
        } catch (imgError) {
          console.error("Erro ao adicionar imagem:", imgError);
          // Continue com outras imagens mesmo se esta falhar
        }
      }
    }
    
    // Adicionar linha para assinatura na última página
    const lastPage = pdf.internal.getNumberOfPages();
    pdf.setPage(lastPage);
    
    const signatureY = pdf.internal.pageSize.height - 60;
    
    // Adicionar assinaturas para cada policial
    if (reportData.officers && reportData.officers.length > 0) {
      let currentSignatureY = signatureY;
      
      for (let i = 0; i < Math.min(reportData.officers.length, 3); i++) { // Limitar a 3 para simplificar
        const officer = reportData.officers[i];
        const signatureWidth = 80;
        const signatureX = (pdf.internal.pageSize.width / 2) - (signatureWidth / 2);
        
        pdf.line(signatureX, currentSignatureY, signatureX + signatureWidth, currentSignatureY);
        pdf.text(officer.name, pdf.internal.pageSize.width / 2, currentSignatureY + 8, { align: "center" });
        pdf.text(officer.role, pdf.internal.pageSize.width / 2, currentSignatureY + 15, { align: "center" });
        
        currentSignatureY += 30;
      }
      
      pdf.text(`Goiânia, ${formatDate(reportData.reportDate)}`, pdf.internal.pageSize.width / 2, currentSignatureY + 5, { align: "center" });
    } else {
      pdf.line(65, signatureY, 145, signatureY);
      pdf.text(officerName, 105, signatureY + 8, { align: "center" });
      pdf.text("Agente de Polícia", 105, signatureY + 15, { align: "center" });
      pdf.text(`Goiânia, ${formatDate(reportData.reportDate)}`, 105, signatureY + 25, { align: "center" });
    }
    
    // Salvar o PDF
    pdf.save(fileName);
    
    // Mostrar mensagem de sucesso
    toast.success("Relatório exportado com sucesso como PDF");
  } catch (error) {
    console.error("Erro na exportação para PDF:", error);
    toast.error("Erro ao exportar o relatório como PDF. Tente novamente.");
  }
}