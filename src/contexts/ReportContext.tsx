
import { createContext, useContext, ReactNode } from "react";
import { ReportContextType } from "../types/report";
import { useReportActions } from "../hooks/useReportActions";

// Create the context
const ReportContext = createContext<ReportContextType | null>(null);

// Custom hook to use the report context
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};

// Provider component
type ReportProviderProps = {
  children: ReactNode;
};

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const reportActions = useReportActions();

  return (
    <ReportContext.Provider value={reportActions}>
      {children}
    </ReportContext.Provider>
  );
};

// Re-export types from the types file for backward compatibility
export type { 
  PoliceOfficer, 
  Occurrence, 
  ImageWithDescription, 
  ReportData 
} from "../types/report";
