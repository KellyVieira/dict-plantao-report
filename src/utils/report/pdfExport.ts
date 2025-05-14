import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { toast } from "sonner";

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
    pdf.text(`Plantonista: ${reportData.officerName || "N/A"}`, 20, 58);
    pdf.text(`Data: ${reportData.date || "N/A"}`, 20, 66);
    pdf.text(`Horário: ${reportData.time || "N/A"}`, 20, 74);
    
    // Título da seção de ocorrências
    pdf.setFontSize(14);
    pdf.text("OCORRÊNCIAS REGISTRADAS:", 20, 90);
    
    // Conteúdo das ocorrências
    pdf.setFontSize(12);
    
    if (reportData.occurrences && reportData.occurrences.trim()) {
      // Quebrar texto longo em múltiplas linhas
      const occurrencesText = reportData.occurrences.trim();
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
    let yPos = pdf.internal.pageSize.height - 60;
    
    if (reportData.notes && reportData.notes.trim()) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("OBSERVAÇÕES:", 20, 20);
      
      pdf.setFontSize(12);
      const notesText = reportData.notes.trim();
      const splitNotes = pdf.splitTextToSize(notesText, 170);
      pdf.text(splitNotes, 20, 30);
      
      yPos = pdf.internal.pageSize.height - 60;
    }
    
    // Adicionar linha para assinatura na última página
    pdf.line(65, yPos + 10, 145, yPos + 10);
    pdf.text(reportData.officerName || "Agente de Polícia", 105, yPos + 18, { align: "center" });
    pdf.text("Agente de Polícia", 105, yPos + 25, { align: "center" });
    pdf.text(`Goiânia, ${new Date().toLocaleDateString()}`, 105, yPos + 35, { align: "center" });
    
    // Salvar o PDF
    pdf.save(fileName);
    
    // Mostrar mensagem de sucesso
    toast.success("Relatório exportado com sucesso como PDF");
  } catch (error) {
    console.error("Erro na exportação para PDF:", error);
    toast.error("Erro ao exportar o relatório como PDF. Tente novamente.");
  }
}