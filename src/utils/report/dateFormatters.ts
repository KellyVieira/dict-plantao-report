
import { ReportData } from "../../types/report";

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return "";
  try {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString('pt-BR')} às ${dateTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateTimeString;
  }
}
