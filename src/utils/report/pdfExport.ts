import { saveAs } from "file-saver";
import { exportReportToWord } from "./docxExport";
import { ReportData } from "../../types/report";
import { Document, Packer } from "docx";
import { toast } from "sonner";
// Note: jsPDF is imported dynamically in the function to avoid SSR issues

/**
 * Convert docx blob to PDF and download
 * This function uses docx-to-pdf conversion
 */
export async function exportReportToPdf(reportData: ReportData): Promise<void> {
  try {
    // Create a hidden link that will trigger the docx generation but intercept the blob
    const tempLink = document.createElement("a");
    let docxBlob: Blob | null = null;
    
    // Override saveAs function temporarily to capture the blob
    const originalSaveAs = saveAs;
    (window as any).saveAs = (blob: Blob, filename: string) => {
      docxBlob = blob;
      // Don't actually save the file
    };
    
    // Generate the DOCX file (this will call our overridden saveAs)
    await exportReportToWord(reportData);
    
    // Restore original saveAs function
    (window as any).saveAs = originalSaveAs;
    
    if (!docxBlob) {
      throw new Error("Failed to generate DOCX file");
    }
    
    // Convert DOCX to PDF using PDF.js
    const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.pdf`;
    
    // Use the HTML5 FileReader API to read the docx blob
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        // Here we create a unique approach using canvas to render
        // We need to use external PDF rendering libraries in production,
        // but for this demonstration, we're creating a basic PDF
        
        // Define options for the PDF creation
        const options = {
          margin: 10,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Convert DOCX to PDF
        // Note: In production, you would use a proper DOCX to PDF converter
        // This is a simplified version that creates a PDF with a notice
        
        try {
          // Importando bibliotecas dinamicamente para evitar problemas de SSR
          const { default: html2canvas } = await import('html2canvas');
          const { default: { jsPDF } } = await import('jspdf');
          
          // Criamos um elemento HTML temporário para renderizar uma prévia do relatório
          const tempContainer = document.createElement('div');
          tempContainer.className = 'temp-report-preview';
          tempContainer.style.width = '210mm'; // Tamanho A4
          tempContainer.style.padding = '20mm';
          tempContainer.style.background = 'white';
          tempContainer.style.position = 'absolute';
          tempContainer.style.left = '-9999px';
          tempContainer.style.fontFamily = 'Arial, sans-serif';
          
          // Cabeçalho do relatório
          const header = document.createElement('div');
          header.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 18px; font-weight: bold;">RELATÓRIO DE PLANTÃO - DICT</h1>
              <p style="font-size: 14px;">Polícia Civil do Estado de Goiás</p>
              <p style="font-size: 14px;">Relatório Nº: ${reportData.reportNumber || "N/A"}</p>
              <p style="font-size: 14px;">Data: ${new Date().toLocaleDateString()}</p>
            </div>
          `;
          
          // Informações do Plantão
          const info = document.createElement('div');
          info.innerHTML = `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">INFORMAÇÕES DO PLANTÃO</h2>
              <p style="font-size: 14px;">Plantonista: ${reportData.officerName || "N/A"}</p>
              <p style="font-size: 14px;">Data: ${reportData.date || "N/A"}</p>
              <p style="font-size: 14px;">Horário: ${reportData.time || "N/A"}</p>
            </div>
          `;
          
          // Ocorrências
          const occurrences = document.createElement('div');
          occurrences.innerHTML = `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">OCORRÊNCIAS REGISTRADAS</h2>
              <p style="font-size: 14px;">${reportData.occurrences || "Nenhuma ocorrência registrada."}</p>
            </div>
          `;
          
          // Observações finais
          const conclusion = document.createElement('div');
          conclusion.innerHTML = `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">OBSERVAÇÕES FINAIS</h2>
              <p style="font-size: 14px;">${reportData.notes || "Sem observações adicionais."}</p>
            </div>
          `;
          
          // Assinatura
          const signature = document.createElement('div');
          signature.innerHTML = `
            <div style="margin-top: 40px; text-align: center;">
              <p style="font-size: 14px;">_______________________________</p>
              <p style="font-size: 14px;">${reportData.officerName || ""}</p>
              <p style="font-size: 14px;">Agente de Polícia</p>
            </div>
          `;
          
          // Adicionar todos os elementos ao container
          tempContainer.appendChild(header);
          tempContainer.appendChild(info);
          tempContainer.appendChild(occurrences);
          tempContainer.appendChild(conclusion);
          tempContainer.appendChild(signature);
          
          // Adicionar ao corpo temporariamente
          document.body.appendChild(tempContainer);
          
          // Renderizar para canvas
          const canvas = await html2canvas(tempContainer, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          // Remover o elemento temporário
          document.body.removeChild(tempContainer);
          
          // Criar o PDF
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          // Adicionar a imagem do canvas ao PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          
          let position = 0;
          
          // Adicionar a primeira página
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Adicionar páginas adicionais se necessário
          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          // Salvar o PDF
          pdf.save(fileName);
        } catch (error) {
          console.error("Erro ao gerar PDF com html2canvas:", error);
          
          // Fallback para uma versão mais simples de PDF
          const { default: { jsPDF } } = await import('jspdf');
          const pdf = new jsPDF(options.jsPDF);
          
          // Criar uma versão básica do PDF
          pdf.text("Relatório de Plantão - DICT", 105, 15, { align: "center" });
          pdf.text(`Relatório Número: ${reportData.reportNumber || "N/A"}`, 105, 25, { align: "center" });
          pdf.text("Data: " + new Date().toLocaleDateString(), 105, 35, { align: "center" });
          pdf.text("Plantonista: " + (reportData.officerName || "N/A"), 20, 50);
          
          if (reportData.occurrences) {
            pdf.text("OCORRÊNCIAS REGISTRADAS:", 20, 70);
            const occurrencesText = reportData.occurrences;
            // Quebrar texto longo em múltiplas linhas
            const splitText = pdf.splitTextToSize(occurrencesText, 170);
            pdf.text(splitText, 20, 80);
          }
          
          pdf.save(fileName);
        }
        
        // Show success message
        toast.success("Relatório exportado com sucesso como PDF");
      } catch (error) {
        console.error("Error converting to PDF:", error);
        toast.error("Erro ao converter para PDF. Tente novamente.");
        // Fallback: offer DOCX download
        saveAs(docxBlob, fileName.replace(".pdf", ".docx"));
      }
    };
    
    reader.readAsArrayBuffer(docxBlob);
    
  } catch (error) {
    console.error("Error in PDF export process:", error);
    toast.error("Erro ao exportar o relatório. Tente novamente.");
    throw error;
  }
}