
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText, FileOutput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReportData } from "../../types/report";
import { exportReportToWord } from "../../utils/report/docxExport";
import { exportReportToPdf } from "../../utils/report/pdfExport";

type ExportButtonsProps = {
  reportData: ReportData;
  onViewReport: () => void;
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
};

const ExportButtons = ({ 
  reportData, 
  onViewReport, 
  isExporting, 
  setIsExporting 
}: ExportButtonsProps) => {
  const { toast } = useToast();

  const handleExportToWord = async () => {
    setIsExporting(true);
    toast({
      title: "Exportando DOCX",
      description: "Por favor, aguarde enquanto o arquivo é gerado..."
    });

    try {
      await exportReportToWord(reportData);
      
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

  const handleExportToPdf = async () => {
    setIsExporting(true);
    toast({
      title: "Exportando PDF",
      description: "Por favor, aguarde enquanto o arquivo é gerado..."
    });

    try {
      await exportReportToPdf(reportData);
      
      toast({
        title: "PDF exportado com sucesso!",
        description: "O arquivo foi baixado para o seu dispositivo."
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
      <Button 
        className="bg-police-blue hover:bg-police-lightblue flex-1 gap-2 py-6" 
        onClick={onViewReport}
        disabled={isExporting}
      >
        <Eye className="h-5 w-5" />
        Visualizar Relatório
      </Button>
      
      <Button 
        className="bg-blue-700 hover:bg-blue-800 flex-1 gap-2 py-6" 
        onClick={handleExportToWord}
        disabled={isExporting}
      >
        <FileText className="h-5 w-5" />
        Exportar .DOCX
      </Button>

      <Button 
        className="bg-red-600 hover:bg-red-700 flex-1 gap-2 py-6" 
        onClick={handleExportToPdf}
        disabled={isExporting}
      >
        <FileOutput className="h-5 w-5" />
        Exportar .PDF
      </Button>
    </div>
  );
};

export default ExportButtons;
