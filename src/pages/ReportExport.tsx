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

const ReportExport = () => {
  const { reportData } = useReport();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const reportHtmlRef = useRef<HTMLDivElement>(null);
  const reportHtml = generateFullReportHTML(reportData);

  const handleViewReport = () => {
    setShowPreview(true);
  };

  const exportToPDF = () => {
    toast({
      title: "Exportação para PDF",
      description: "Esta funcionalidade seria integrada com uma biblioteca de geração de PDF como jsPDF."
    });
  };

  const exportToWord = () => {
    toast({
      title: "Exportação para DOCX",
      description: "Esta funcionalidade seria integrada com uma biblioteca para geração de documentos DOCX."
    });
    
    // In a real implementation, we could use a library like docx-js
    // For now, we'll offer a workaround by downloading the HTML content
    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer title="Visualização e Exportação do Relatório">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
          <Button 
            className="bg-police-blue hover:bg-police-lightblue flex-1 gap-2 py-6" 
            onClick={handleViewReport}
          >
            <Eye className="h-5 w-5" />
            Visualizar Relatório
          </Button>
          
          <Button 
            className="bg-red-700 hover:bg-red-800 flex-1 gap-2 py-6" 
            onClick={exportToPDF}
          >
            <File className="h-5 w-5" />
            Exportar PDF
          </Button>
          
          <Button 
            className="bg-blue-700 hover:bg-blue-800 flex-1 gap-2 py-6" 
            onClick={exportToWord}
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
