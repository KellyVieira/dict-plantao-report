
// Types for the report system
export type PoliceOfficer = {
  id: string;
  name: string;
  role: string;
};

export type Occurrence = {
  id: string;
  raiNumber: string;
  nature: string;
  summary: string;
  responsibleOffice: string;
};

export type ImageWithDescription = {
  id: string;
  file: File;
  dataUrl: string;
  description: string;
};

export type ReportData = {
  // Page 1 - Initial Information
  reportDate: string;
  reportNumber: string;
  startDateTime: string;
  endDateTime: string;
  teamName: string;
  responsibleOffice: string;
  officers: PoliceOfficer[];
  
  // Page 2 - Occurrences
  hasOccurrences: boolean;
  occurrences: Occurrence[];
  
  // Page 3 - Images and Notes
  images: ImageWithDescription[];
  observations: string;
};

export type ReportContextType = {
  reportData: ReportData;
  updateReportData: (data: Partial<ReportData>) => void;
  addOfficer: () => void;
  updateOfficer: (id: string, data: Partial<PoliceOfficer>) => void;
  removeOfficer: (id: string) => void;
  addOccurrence: () => void;
  updateOccurrence: (id: string, data: Partial<Occurrence>) => void;
  removeOccurrence: (id: string) => void;
  addImage: (file: File) => void;
  updateImageDescription: (id: string, description: string) => void;
  removeImage: (id: string) => void;
  resetReport: () => void;
};
