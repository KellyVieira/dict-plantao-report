
import { useState, useRef } from "react";
import { useReport } from "../contexts/ReportContext";
import { Button } from "@/components/ui/button";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import { 
  generateFullReportHTML, 
  formatDate, 
  formatDateTime 
} from "../utils/reportUtils";
import { Eye, FileText, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "jspdf-html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const ReportExport = () => {
  const { reportData } = useReport();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportHtmlRef = useRef<HTMLDivElement>(null);
  const reportHtml = generateFullReportHTML(reportData);

  const handleViewReport = () => {
    setShowPreview(true);
  };

  const exportToPDF = async () => {
    if (!reportHtmlRef.current) {
      toast({
        title: "Erro na exportação",
        description: "A visualização do relatório precisa estar ativa para exportar como PDF.",
        variant: "destructive"
      });
      setShowPreview(true);
      return;
    }

    setIsExporting(true);
    toast({
      title: "Exportando PDF",
      description: "Por favor, aguarde enquanto o arquivo é gerado..."
    });

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      await html2canvas(pdf, reportHtmlRef.current, {
        scale: 0.8,
        windowWidth: 800,
        scrollY: -window.scrollY
      });

      pdf.save(`Relatório_Plantão_${reportData.reportNumber || "DICT"}.pdf`);

      toast({
        title: "PDF exportado com sucesso!",
        description: "O arquivo foi baixado para o seu dispositivo."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = async () => {
    setIsExporting(true);
    toast({
      title: "Exportando DOCX",
      description: "Por favor, aguarde enquanto o arquivo é gerado..."
    });

    try {
      // Extract text content from HTML
      const title = `Relatório de Plantão ${reportData.reportNumber || ""}`;
      const date = `Data: ${formatDate(reportData.reportDate)}`;
      const period = `Período: ${formatDateTime(reportData.startDateTime)} a ${formatDateTime(reportData.endDateTime)}`;
      const team = `Equipe: ${reportData.teamName || ""}`;
      const office = `Cartório responsável: ${reportData.responsibleOffice || ""}`;

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: date,
              }),
              new Paragraph({
                text: period,
              }),
              new Paragraph({
                text: team,
              }),
              new Paragraph({
                text: office,
              }),
              new Paragraph({
                text: " ",
              }),
              new Paragraph({
                text: "Dados Gerais",
                heading: HeadingLevel.HEADING_2,
              }),
              ...reportData.officers.map(officer => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${officer.name} - ${officer.role}`,
                    }),
                  ],
                })
              ),
              new Paragraph({
                text: " ",
              }),
              new Paragraph({
                text: "Ocorrências",
                heading: HeadingLevel.HEADING_2,
              }),
              ...(reportData.hasOccurrences && reportData.occurrences.length > 0
                ? reportData.occurrences.map(occurrence => [
                    new Paragraph({ text: `RAI: ${occurrence.raiNumber}` }),
                    new Paragraph({ text: `Natureza: ${occurrence.nature}` }),
                    new Paragraph({ text: `Resumo: ${occurrence.summary}` }),
                    new Paragraph({ text: `Cartório: ${occurrence.responsibleOffice}` }),
                    new Paragraph({ text: " " }),
                  ]).flat()
                : [new Paragraph({ text: "Não houve ocorrências durante o plantão." })]
              ),
              new Paragraph({
                text: " ",
              }),
              new Paragraph({
                text: "Observações",
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph({
                text: reportData.observations || "Sem observações adicionais.",
              }),
            ],
          },
        ],
      });

      // Generate and save document
      const buffer = await Packer.toBuffer(doc);
      saveAs(new Blob([buffer]), `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`);

      toast({
        title: "DOCX exportado com sucesso!",
        description: "O arquivo foi baixado para o seu dispositivo."
      });
    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo DOCX. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageContainer title="Visualização e Exportação do Relatório">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
          <Button 
            className="bg-police-blue hover:bg-police-lightblue flex-1 gap-2 py-6" 
            onClick={handleViewReport}
            disabled={isExporting}
          >
            <Eye className="h-5 w-5" />
            Visualizar Relatório
          </Button>
          
          <Button 
            className="bg-red-700 hover:bg-red-800 flex-1 gap-2 py-6" 
            onClick={exportToPDF}
            disabled={isExporting}
          >
            <File className="h-5 w-5" />
            Exportar PDF
          </Button>
          
          <Button 
            className="bg-blue-700 hover:bg-blue-800 flex-1 gap-2 py-6" 
            onClick={exportToWord}
            disabled={isExporting}
          >
            <FileText className="h-5 w-5" />
            Exportar .DOCX
          </Button>
        </div>

        {showPreview && (
          <div className="border rounded-lg shadow-lg p-6 bg-white">
            <div 
              ref={reportHtmlRef} 
              className="relative"
              dangerouslySetInnerHTML={{ __html: reportHtml }} 
            />
          </div>
        )}
        
        {!showPreview && (
          <div className="text-center p-10 border border-dashed rounded-md">
            <p className="text-gray-500 mb-4">
              Clique em "Visualizar Relatório" para ver a prévia do documento final.
            </p>
            <div className="flex flex-col space-y-2 max-w-md mx-auto text-left bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-center">Resumo do Relatório</h3>
              <p><strong>Número:</strong> {reportData.reportNumber || "Não definido"}</p>
              <p><strong>Data:</strong> {formatDate(reportData.reportDate)}</p>
              <p><strong>Período:</strong> {formatDateTime(reportData.startDateTime)} a {formatDateTime(reportData.endDateTime)}</p>
              <p><strong>Equipe:</strong> {reportData.teamName || "Não definida"}</p>
              <p><strong>Cartório responsável:</strong> {reportData.responsibleOffice || "Não definido"}</p>
              <p><strong>Ocorrências registradas:</strong> {reportData.hasOccurrences ? reportData.occurrences.length : "Nenhuma"}</p>
              <p><strong>Imagens anexadas:</strong> {reportData.images.length}</p>
            </div>
          </div>
        )}
      </div>

      <PageNavigation prevPage="/images-notes" />
    </PageContainer>
  );
};

export default ReportExport;
