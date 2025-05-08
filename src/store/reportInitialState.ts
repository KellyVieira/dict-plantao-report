
import { ReportData } from "../types/report";

export const initialReportData: ReportData = {
  // Page 1
  reportDate: new Date().toISOString().split('T')[0],
  reportNumber: "",
  startDateTime: "",
  endDateTime: "",
  teamName: "",
  responsibleOffice: "",
  officers: [],
  
  // Page 2
  hasOccurrences: false,
  occurrences: [],
  
  // Page 3
  images: [],
  observations: "",
};
