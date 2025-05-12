
// Re-export all utility functions for easier imports
export { formatDate, formatDateTime } from './dateFormatters';
export { getIntroductoryText, getObservationsText } from './textGenerators';
export { 
  getOccurrencesTable, 
  getImagesHTML, 
  getSignatureBlocks 
} from './htmlGenerators';
export { generateFullReportHTML } from './reportGenerator';
export { exportReportToWord } from './docxExport';
export { processImageForDocx, base64ToBlob, base64ToUint8Array } from './imageProcessing';
export { loadEmblems, getEmblems } from './emblems';
