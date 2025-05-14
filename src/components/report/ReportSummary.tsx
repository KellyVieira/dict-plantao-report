
import { ReportData } from "../../types/report";
import { formatDate, formatDateTime } from "../../utils/report";

type ReportSummaryProps = {
  reportData: ReportData;
};

const ReportSummary = ({ reportData }: ReportSummaryProps) => {
  return (
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
  );
};

export default ReportSummary;
