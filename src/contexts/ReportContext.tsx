
import { createContext, useContext, useState, ReactNode } from "react";

// Types for our context
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

type ReportContextType = {
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

const initialReportData: ReportData = {
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

const ReportContext = createContext<ReportContextType | null>(null);

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};

type ReportProviderProps = {
  children: ReactNode;
};

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [reportData, setReportData] = useState<ReportData>(initialReportData);

  const updateReportData = (data: Partial<ReportData>) => {
    setReportData(prevData => ({ ...prevData, ...data }));
  };

  const addOfficer = () => {
    const newOfficer: PoliceOfficer = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
    };

    setReportData(prevData => ({
      ...prevData,
      officers: [...prevData.officers, newOfficer],
    }));
  };

  const updateOfficer = (id: string, data: Partial<PoliceOfficer>) => {
    setReportData(prevData => ({
      ...prevData,
      officers: prevData.officers.map(officer =>
        officer.id === id ? { ...officer, ...data } : officer
      ),
    }));
  };

  const removeOfficer = (id: string) => {
    setReportData(prevData => ({
      ...prevData,
      officers: prevData.officers.filter(officer => officer.id !== id),
    }));
  };

  const addOccurrence = () => {
    const newOccurrence: Occurrence = {
      id: crypto.randomUUID(),
      raiNumber: "",
      nature: "",
      summary: "",
      responsibleOffice: "",
    };

    setReportData(prevData => ({
      ...prevData,
      occurrences: [...prevData.occurrences, newOccurrence],
    }));
  };

  const updateOccurrence = (id: string, data: Partial<Occurrence>) => {
    setReportData(prevData => ({
      ...prevData,
      occurrences: prevData.occurrences.map(occurrence =>
        occurrence.id === id ? { ...occurrence, ...data } : occurrence
      ),
    }));
  };

  const removeOccurrence = (id: string) => {
    setReportData(prevData => ({
      ...prevData,
      occurrences: prevData.occurrences.filter(occurrence => occurrence.id !== id),
    }));
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const newImage: ImageWithDescription = {
        id: crypto.randomUUID(),
        file,
        dataUrl: reader.result as string,
        description: "",
      };

      setReportData(prevData => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));
    };
  };

  const updateImageDescription = (id: string, description: string) => {
    setReportData(prevData => ({
      ...prevData,
      images: prevData.images.map(image =>
        image.id === id ? { ...image, description } : image
      ),
    }));
  };

  const removeImage = (id: string) => {
    setReportData(prevData => ({
      ...prevData,
      images: prevData.images.filter(image => image.id !== id),
    }));
  };

  const resetReport = () => {
    setReportData(initialReportData);
  };

  const value = {
    reportData,
    updateReportData,
    addOfficer,
    updateOfficer,
    removeOfficer,
    addOccurrence,
    updateOccurrence,
    removeOccurrence,
    addImage,
    updateImageDescription,
    removeImage,
    resetReport,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};
