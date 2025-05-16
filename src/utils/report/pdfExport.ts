import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { toast } from "sonner";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import { jsPDF } from "jspdf";

/**
 * Exporta o relatório para PDF seguindo a estrutura e formatação oficial
 */
export async function exportReportToPdf(reportData: ReportData): Promise<void> {
  try {
    // Nome do arquivo
    const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.pdf`;
    
    // Mostrar mensagem de preparação
    toast.info("Preparando exportação para PDF, por favor aguarde...");
    
    // Criar instância de PDF com orientação retrato e tamanho A4
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    // Configurar fonte e margens
    pdf.setFont("times", "normal");
    
    // Margens do documento em mm
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    
    // Variável para controlar o número de páginas
    let currentPage = 1;
    
    // Função para adicionar cabeçalho institucional em cada página
    const addPageHeader = (pageNum) => {
      // Limpar qualquer conteúdo na área do cabeçalho para evitar sobreposição
      pdf.setFillColor(255, 255, 255); // Cor branca
      pdf.rect(0, 0, pageWidth, 65, 'F');
      
      // Adicionar número da página (canto superior direito)
      pdf.setFontSize(10);
      pdf.setFont("times", "normal");
      pdf.text(`Página ${pageNum}`, pageWidth - margin, 10, { align: "right" });
      
      // Adicionar linha horizontal abaixo
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 15, pageWidth - margin, 15);
      
      // Adicionar texto centralizado do cabeçalho institucional
      pdf.setFontSize(11);
      pdf.setFont("times", "bold");
      const textLines = [
        "ESTADO DE GOIÁS",
        "SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA",
        "POLÍCIA CIVIL",
        "DELEGACIA ESPECIALIZADA EM INVESTIGAÇÕES DE CRIMES DE",
        "TRÂNSITO - DICT DE GOIÂNIA"
      ];
      
      // Desenhar o texto centralizado
      let currentY = 25;
      textLines.forEach(line => {
        pdf.text(line, pageWidth / 2, currentY, { align: "center" });
        currentY += 5;
      });
      
      // Retornar a posição Y após o cabeçalho
      return currentY + 15; // Posição inicial para o conteúdo
    };
    
    // Adicionar primeira página e cabeçalho
    let y = addPageHeader(currentPage);
    
    // Função helper para adicionar nova página quando necessário
    const addNewPage = () => {
      pdf.addPage();
      currentPage++;
      y = addPageHeader(currentPage);
      return y; // Retorna a nova posição Y após adicionar o cabeçalho
    };
    
    // Função para verificar se precisa adicionar nova página
    const checkAndAddNewPage = (heightNeeded) => {
      const remainingSpace = pageHeight - margin - y;
      if (remainingSpace < heightNeeded) {
        addNewPage();
        return true;
      }
      return false;
    };
    
    // Adicionar título do relatório
    async function addReportTitle() {
      // Adicionar título do relatório
      pdf.setFontSize(14);
      pdf.setFont("times", "bold");
      pdf.text(`RELATÓRIO DE PLANTÃO ${reportData.reportNumber || ""}`, pageWidth / 2, y, { align: "center" });
      y += 10;
      
      // Adicionar data do relatório
      pdf.setFontSize(12);
      pdf.setFont("times", "italic");
      pdf.text(formatDate(reportData.reportDate), pageWidth / 2, y, { align: "center" });
      y += 20; // Espaço após a data
      
      return y;
    }
    
    // Adicionar texto introdutório
    async function addIntroduction() {
      pdf.setFontSize(12);
      pdf.setFont("times", "normal");
      
      const introText = getIntroductoryText(reportData).replace(/<[^>]*>/g, '');
      const splitText = pdf.splitTextToSize(introText, contentWidth);
      
      // Verificar se é necessário adicionar nova página
      if (y + (splitText.length * 7) > pageHeight - margin) {
        addNewPage();
      }
      
      // Definir alinhamento justificado para o texto com espaçamento melhorado
      pdf.text(splitText, margin, y, { 
        align: "justify",
        lineHeightFactor: 1.2 // Aumenta o espaçamento entre linhas para melhor legibilidade
      });
      y += splitText.length * 7; // Ajuste o multiplicador conforme necessário
      
      // Adicionar espaço após o texto
      y += 10;
      
      return y;
    }
    
    // Função para adicionar as tabelas de dados
    async function addDataTables() {
      checkAndAddNewPage(40);
      
      // Dados do plantão
      const tableData = [
        ["Início do Plantão", formatDateTime(reportData.startDateTime) || ""],
        ["Fim do Plantão", formatDateTime(reportData.endDateTime) || ""],
        ["Nome da Equipe", reportData.teamName || ""],
        ["Cartório Responsável", reportData.responsibleOffice || ""]
      ];
      
      // Desenhar a tabela de dados
      const cellPadding = 5;
      const rowHeight = 10;
      const col1Width = 60;
      const col2Width = contentWidth - col1Width;
      
      // Desenhar a tabela com linhas de separação
      pdf.setDrawColor(211, 211, 211); // Cor cinza claro para as linhas da tabela
      pdf.setLineWidth(0.3);
      
      // Desenhar a linha superior da tabela
      pdf.line(margin, y, margin + contentWidth, y);
      
      // Desenhar as linhas da tabela de dados gerais
      for (let i = 0; i < tableData.length; i++) {
        const currentY = y + (i * rowHeight);
        
        // Verificar se precisa de nova página
        if (currentY + rowHeight > pageHeight - margin) {
          addNewPage();
          // Recalcular currentY após adicionar nova página
          const newRowIndex = i;
          const newCurrentY = y + ((newRowIndex - i) * rowHeight);
          
          // Desenhar a linha superior da tabela na nova página
          pdf.line(margin, y, margin + contentWidth, y);
          
          // Desenhar células
          pdf.setFillColor(240, 240, 240); // Cinza claro para a primeira coluna
          pdf.rect(margin, newCurrentY, col1Width, rowHeight, 'F');
          pdf.setFont("times", "bold");
          pdf.text(tableData[i][0], margin + cellPadding, newCurrentY + 7);
          
          pdf.setFillColor(249, 249, 249); // Cinza mais claro para a segunda coluna
          pdf.rect(margin + col1Width, newCurrentY, col2Width, rowHeight, 'F');
          pdf.setFont("times", "normal");
          pdf.text(tableData[i][1], margin + col1Width + cellPadding, newCurrentY + 7);
          
          // Desenhar a linha horizontal após esta linha
          pdf.line(margin, newCurrentY + rowHeight, margin + contentWidth, newCurrentY + rowHeight);
        } else {
          // Desenhar células
          pdf.setFillColor(240, 240, 240); // Cinza claro para a primeira coluna
          pdf.rect(margin, currentY, col1Width, rowHeight, 'F');
          pdf.setFont("times", "bold");
          pdf.text(tableData[i][0], margin + cellPadding, currentY + 7);
          
          pdf.setFillColor(249, 249, 249); // Cinza mais claro para a segunda coluna
          pdf.rect(margin + col1Width, currentY, col2Width, rowHeight, 'F');
          pdf.setFont("times", "normal");
          pdf.text(tableData[i][1], margin + col1Width + cellPadding, currentY + 7);
          
          // Desenhar a linha horizontal após esta linha
          pdf.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);
        }
        
        // Desenhar as linhas verticais
        pdf.line(margin, y, margin, y + tableData.length * rowHeight);
        pdf.line(margin + col1Width, y, margin + col1Width, y + tableData.length * rowHeight);
        pdf.line(margin + contentWidth, y, margin + contentWidth, y + tableData.length * rowHeight);
      }
      
      // Atualizar a posição Y após a tabela
      y += tableData.length * rowHeight + 15;
      
      // Tabela de policiais (se houver)
      if (reportData.officers && reportData.officers.length > 0) {
        checkAndAddNewPage(30);
        
        // Desenhar a linha superior da tabela
        pdf.line(margin, y, margin + contentWidth, y);
        
        // Cabeçalho da tabela de policiais
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, y, col1Width, rowHeight, 'F');
        pdf.setFont("times", "bold");
        pdf.text("Policiais da Equipe", margin + cellPadding, y + 7);
        
        // Preparar texto de policiais
        let officersText = "";
        reportData.officers.forEach(officer => {
          officersText += `${officer.name} - ${officer.role}\n`;
        });
        
        // Calcular altura necessária para a célula de policiais
        const splitOfficersText = pdf.splitTextToSize(officersText, col2Width - 2 * cellPadding);
        // Garantir que haja espaço suficiente para todos os oficiais
        const officersCellHeight = Math.max(rowHeight, splitOfficersText.length * 8);
        
        // Desenhar a célula de policiais
        pdf.setFillColor(249, 249, 249);
        pdf.rect(margin + col1Width, y, col2Width, officersCellHeight, 'F');
        pdf.setFont("times", "normal");
        pdf.text(splitOfficersText, margin + col1Width + cellPadding, y + 7);
        
        // Desenhar as linhas verticais
        pdf.line(margin, y, margin, y + officersCellHeight);
        pdf.line(margin + col1Width, y, margin + col1Width, y + officersCellHeight);
        pdf.line(margin + contentWidth, y, margin + contentWidth, y + officersCellHeight);
        
        // Desenhar a linha horizontal após esta tabela
        pdf.line(margin, y + officersCellHeight, margin + contentWidth, y + officersCellHeight);
        
        // Atualizar a posição Y
        y += officersCellHeight + 15;
      }
      
      return y;
    }
    
    // Adicionar a seção de ocorrências
    async function addOccurrencesSection() {
      // Verificar se precisa de nova página
      checkAndAddNewPage(40);
      
      // Título da seção
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("1. Resumo das Ocorrências", margin, y);
      y += 10;
      
      if (reportData.hasOccurrences && reportData.occurrences && reportData.occurrences.length > 0) {
        // Desenhar a tabela com linhas de separação
        pdf.setDrawColor(211, 211, 211); // Cor cinza claro para as linhas da tabela
        pdf.setLineWidth(0.3);
        
        // Processar cada ocorrência
        for (const occurrence of reportData.occurrences) {
          checkAndAddNewPage(50);
          
          // Definir dados para a tabela de ocorrência
          const occTableData = [
            ["Número do RAI", occurrence.raiNumber || ""],
            ["Natureza da Ocorrência", occurrence.nature || ""],
            ["Resumo da Ocorrência", occurrence.summary || ""],
            ["Cartório Responsável", occurrence.responsibleOffice || ""]
          ];
          
          // Desenhar a linha superior da tabela
          pdf.line(margin, y, margin + contentWidth, y);
          
          // Desenhar a tabela de ocorrência
          const rowHeight = 10;
          const col1Width = 60;
          const col2Width = contentWidth - col1Width;
          const cellPadding = 5;
          
          for (let i = 0; i < occTableData.length; i++) {
            // Verificar se o texto da segunda coluna precisa ser quebrado
            const text = occTableData[i][1];
            let actualRowHeight;
            let splitText;
            
            if (i === 2 && text) { // Para o Resumo da Ocorrência
              // Aumentar a altura mínima da linha para textos longos
              splitText = pdf.splitTextToSize(text, col2Width - 2 * cellPadding);
              // Garantir que o texto do resumo tenha espaço suficiente
              actualRowHeight = Math.max(rowHeight * 3, splitText.length * 5);
            } else {
              splitText = pdf.splitTextToSize(text, col2Width - 2 * cellPadding);
              actualRowHeight = Math.max(rowHeight, splitText.length * 7);
            }
            
            if (y + actualRowHeight > pageHeight - margin) {
              addNewPage();
              
              // Desenhar a linha superior da tabela na nova página
              pdf.line(margin, y, margin + contentWidth, y);
            }
            
            // Desenhar células
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, y, col1Width, actualRowHeight, 'F');
            pdf.setFont("times", "bold");
            pdf.text(occTableData[i][0], margin + cellPadding, y + 7);
            
            pdf.setFillColor(249, 249, 249);
            pdf.rect(margin + col1Width, y, col2Width, actualRowHeight, 'F');
            pdf.setFont("times", "normal");
            
            // Tratar especialmente o texto do resumo para evitar truncamentos
            if (i === 2) { // Resumo da Ocorrência
              const lineHeight = 5; // Altura da linha menor para textos densos
              pdf.text(splitText, margin + col1Width + cellPadding, y + 7, { 
                align: "left",
                lineHeightFactor: 1.1 // Espaçamento adicional entre linhas
              });
            } else {
              pdf.text(splitText, margin + col1Width + cellPadding, y + 7, { align: "left" });
            }
            
            // Desenhar as linhas verticais para esta linha
            pdf.line(margin, y, margin, y + actualRowHeight);
            pdf.line(margin + col1Width, y, margin + col1Width, y + actualRowHeight);
            pdf.line(margin + contentWidth, y, margin + contentWidth, y + actualRowHeight);
            
            // Desenhar a linha horizontal após esta linha
            pdf.line(margin, y + actualRowHeight, margin + contentWidth, y + actualRowHeight);
            
            y += actualRowHeight;
          }
          
          // Espaço entre ocorrências
          y += 10;
        }
      } else {
        // Mensagem de que não há ocorrências
        pdf.setFontSize(12);
        pdf.setFont("times", "italic");
        pdf.text("Não houve ocorrências durante o plantão.", margin, y);
        y += 10;
      }
      
      // Espaço após a seção de ocorrências
      y += 10;
      
      return y;
    }
    
    // Adicionar a seção de imagens
    async function addImagesSection() {
      // Verificar se precisa de nova página
      checkAndAddNewPage(40);
      
      // Título da seção
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("2. Imagens Relevantes", margin, y);
      y += 10;
      
      if (reportData.images && reportData.images.length > 0) {
        for (let i = 0; i < reportData.images.length; i++) {
          try {
            const image = reportData.images[i];
            
            // Altura estimada para a imagem e sua legenda
            const estimatedHeight = 100; // Ajuste conforme necessário
            
            // Verificar se precisa de nova página
            if (y + estimatedHeight > pageHeight - margin) {
              addNewPage();
            }
            
            // Configurar borda cinza claro para imagens
            pdf.setDrawColor(211, 211, 211); // Cinza claro
            pdf.setLineWidth(0.5);
            
            // Dimensões da imagem e borda
            const imgWidth = 150;
            const imgHeight = 80;
            const startX = pageWidth / 2 - imgWidth / 2;
            
            // Desenhar a borda em volta da imagem
            pdf.rect(startX - 5, y - 5, imgWidth + 10, imgHeight + 10);
            
            // Adicionar a imagem centralizada
            try {
              pdf.addImage(
                image.dataUrl,
                'JPEG',
                startX,
                y,
                imgWidth,
                imgHeight
              );
              y += imgHeight + 10;
              
              // Adicionar a legenda da imagem
              pdf.setFont("times", "italic");
              pdf.setFontSize(10);
              const caption = image.description || `Imagem ${i + 1}`;
              const splitCaption = pdf.splitTextToSize(caption, contentWidth);
              pdf.text(splitCaption, pageWidth / 2, y, { align: "center" });
              y += splitCaption.length * 7 + 15;
            } catch (imgError) {
              console.error("Erro ao adicionar imagem:", imgError);
              pdf.setFont("times", "italic");
              pdf.setFontSize(10);
              pdf.text(`[Erro ao carregar imagem ${i + 1}]`, pageWidth / 2, y + 10, { align: "center" });
              y += 20;
            }
          } catch (error) {
            console.error(`Erro ao processar imagem ${i}:`, error);
          }
        }
      } else {
        // Mensagem de que não há imagens
        pdf.setFontSize(12);
        pdf.setFont("times", "italic");
        pdf.text("Sem imagens relevantes", margin, y);
        y += 10;
      }
      
      // Espaço após a seção de imagens
      y += 10;
      
      return y;
    }
    
    // Adicionar a seção de observações
    async function addObservationsSection() {
      // Verificar se precisa de nova página
      checkAndAddNewPage(40);
      
      // Título da seção
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("3. Observações e Recomendações", margin, y);
      y += 10;
      
      // Texto das observações
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      
      const observationsText = getObservationsText(reportData.observations).replace(/<[^>]*>/g, '');
      if (observationsText.trim()) {
        const splitText = pdf.splitTextToSize(observationsText, contentWidth);
        
        // Verificar se é necessário adicionar nova página
        if (y + (splitText.length * 7) > pageHeight - margin) {
          addNewPage();
        }
        
        pdf.text(splitText, margin, y, { 
          align: "left",
          lineHeightFactor: 1.2 // Melhor espaçamento entre linhas para legibilidade
        });
        y += splitText.length * 7 * 1.2; // Ajuste para o novo espaçamento
      } else {
        pdf.text("Não há informações dignas de nota decorrentes do Plantão ora documentado.", margin, y);
        y += 10;
      }
      
      // Espaço após a seção de observações
      y += 15;
      
      return y;
    }
    
    // Adicionar a seção de conclusão
    async function addConclusionSection() {
      // Verificar se precisa de nova página
      checkAndAddNewPage(40);
      
      // Título da seção
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("4. Conclusão", margin, y);
      y += 10;
      
      // Texto da conclusão
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      const conclusionText = "Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos.";
      const splitText = pdf.splitTextToSize(conclusionText, contentWidth);
      
      pdf.text(splitText, margin, y);
      y += splitText.length * 7 + 15;
      
      return y;
    }
    
    // Adicionar assinaturas
    async function addSignatures() {
      // Verificar se precisa de nova página
      checkAndAddNewPage(40);
      
      // Título da seção
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("Assinaturas", margin, y);
      y += 20;
      
      // Adicionar assinaturas para cada oficial
      if (reportData.officers && reportData.officers.length > 0) {
        for (const officer of reportData.officers) {
          // Verificar se precisa de nova página
          if (y + 40 > pageHeight - margin) {
            addNewPage();
          }
          
          // Linha de assinatura
          const signatureWidth = 80;
          const startX = pageWidth / 2 - signatureWidth / 2;
          pdf.setLineWidth(0.7);
          pdf.setDrawColor(0);
          pdf.line(startX, y, startX + signatureWidth, y);
          y += 7;
          
          // Nome e cargo
          pdf.setFont("times", "normal");
          pdf.setFontSize(12);
          pdf.text(officer.name, pageWidth / 2, y, { align: "center" });
          y += 7;
          pdf.text(officer.role, pageWidth / 2, y, { align: "center" });
          y += 20;
        }
      } else {
        // Assinatura genérica
        const signatureWidth = 80;
        const startX = pageWidth / 2 - signatureWidth / 2;
        pdf.setLineWidth(0.7);
        pdf.setDrawColor(0);
        pdf.line(startX, y, startX + signatureWidth, y);
        y += 7;
        
        pdf.setFont("times", "normal");
        pdf.setFontSize(12);
        pdf.text("Agente de Polícia", pageWidth / 2, y, { align: "center" });
        y += 20;
      }
      
      // Data da assinatura (Goiânia, data)
      pdf.text(`Goiânia, ${formatDate(reportData.reportDate)}`, pageWidth / 2, y, { align: "center" });
      
      return y;
    }
    
    // Função para adicionar rodapé
    function addDocumentFooter() {
      const footerY = pageHeight - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(255, 0, 0); // Vermelho
      pdf.setFont("times", "bold");
      pdf.text("DOCUMENTO RESERVADO - DICT", pageWidth / 2, footerY, { align: "center" });
      pdf.setTextColor(0, 0, 0); // Voltar para preto
    }
    
    // Executar a sequência de geração
    await addReportTitle();
    await addIntroduction();
    await addDataTables();
    await addOccurrencesSection();
    await addImagesSection();
    await addObservationsSection();
    await addConclusionSection();
    await addSignatures();
    
    // Adicionar rodapé em todas as páginas
    for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
      pdf.setPage(i);
      addDocumentFooter();
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