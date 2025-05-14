
import { useState } from "react";
import { useReport } from "../contexts/ReportContext";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import ExportButtons from "../components/report/ExportButtons";
import ReportPreview from "../components/report/ReportPreview";
import ReportSummary from "../components/report/ReportSummary";

const ReportExport = () => {
  const { reportData } = useReport();
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleViewReport = () => {
    setShowPreview(true);
  };

  return (
    <PageContainer title="Visualização e Exportação do Relatório">
      <div className="space-y-6">
        <ExportButtons 
          reportData={reportData}
          onViewReport={handleViewReport}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />

        {showPreview ? (
          <ReportPreview reportData={reportData} />
        ) : (
          <ReportSummary reportData={reportData} />
        )}
      </div>

      <PageNavigation prevPage="/images-notes" />
    </PageContainer>
  );
};

export default ReportExport;
