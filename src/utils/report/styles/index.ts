
/**
 * Re-export all style utilities from a single entry point
 */

// Export constants
export { 
  FONTS, 
  COLORS, 
  SPACING, 
  INDENTATION, 
  MARGINS 
} from './constants';

// Export paragraph styles
export { 
  getHeading1Style, 
  getHeading2Style, 
  getSectionTitleStyle, 
  getNormalStyle, 
  getFirstLineIndentStyle,
  getDocumentFooter
} from './paragraphStyles';

// Export table styles
export { 
  createDataTable, 
  createOfficersDataTable, 
  createImageTable 
} from './tableStyles';

// Export header/footer styles
export { 
  createInstitutionalHeader 
} from './headerFooter';
