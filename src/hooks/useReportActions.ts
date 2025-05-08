
import { useState } from "react";
import { ReportData, PoliceOfficer, Occurrence, ImageWithDescription } from "../types/report";
import { initialReportData } from "../store/reportInitialState";

export const useReportActions = () => {
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

  return {
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
};
