
// Re-export all utility functions for easier imports
export { formatDate, formatDateTime } from './dateFormatters';
export { getIntroductoryText, getObservationsText } from './textGenerators';
export { 
  getOccurrencesTable, 
  getImagesHTML, 
  getSignatureBlocks 
} from './htmlGenerators';
export { generateFullReportHTML } from './reportGenerator';
