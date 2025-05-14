
import { useEffect, useRef } from "react";
import { ReportData } from "../../types/report";
import { generateFullReportHTML } from "../../utils/report";
import { loadEmblems } from "../../utils/report/emblems";

type ReportPreviewProps = {
  reportData: ReportData;
};

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  const reportHtmlRef = useRef<HTMLDivElement>(null);
  const reportHtml = generateFullReportHTML(reportData);
  
  useEffect(() => {
    // Load emblems when the component mounts
    const loadImages = async () => {
      try {
        await loadEmblems();
      } catch (error) {
        console.error("Error loading images for preview:", error);
      }
    };
    
    loadImages();
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
