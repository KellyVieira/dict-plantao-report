
import { useEffect, useRef } from "react";
import { ReportData } from "../../types/report";
import { generateFullReportHTML } from "../../utils/report";
import { loadEmblems } from "../../utils/report/documentStructure";

type ReportPreviewProps = {
  reportData: ReportData;
};

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  const reportHtmlRef = useRef<HTMLDivElement>(null);
  const reportHtml = generateFullReportHTML(reportData);
  
  useEffect(() => {
    // Load emblems when the component mounts
    loadEmblems();
  }, []);

  return (
    <div className="border rounded-lg shadow-lg p-6 bg-white">
      <div 
        ref={reportHtmlRef} 
        className="relative"
        dangerouslySetInnerHTML={{ __html: reportHtml }} 
      />
    </div>
  );
};

export default ReportPreview;
