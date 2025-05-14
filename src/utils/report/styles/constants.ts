
/**
 * Constants for document styling
 */
import { convertInchesToTwip } from 'docx';

export const FONTS = {
  TIMES_NEW_ROMAN: 'Times New Roman'
};

export const COLORS = {
  RED: 'FF0000',
  LIGHT_GRAY: 'F2F2F2',
  VERY_LIGHT_GRAY: 'F9F9F9',
  PAGE_BORDER: 'D3D3D3',
  WHITE: 'FFFFFF',
  BLACK: '000000'
};

export const SPACING = {
  LINE: {
    SINGLE: 240, // 1.0 line spacing in twips
    ONE_HALF: 360 // 1.5 line spacing in twips
  },
  BEFORE: {
    STANDARD: 120, // 6pt
    HEADING: 240,  // 12pt
    SMALL: 60,     // 3pt
    DOUBLE: 480    // 24pt
  },
  AFTER: {
    STANDARD: 120, // 6pt
    HEADING: 240,  // 12pt
    SMALL: 60      // 3pt
  },
  SECTION: {
    DOUBLE: 480    // 24pt - for between main sections
  }
};

export const INDENTATION = {
  FIRST_LINE: 567 // 2cm in twips (567 = approximately 2cm)
};

export const MARGINS = {
  TOP: convertInchesToTwip(1.18),    // 3.0 cm (30 mm)
  BOTTOM: convertInchesToTwip(0.98), // 2.5 cm (25 mm)
  LEFT: convertInchesToTwip(1.18),   // 3.0 cm (30 mm)
  RIGHT: convertInchesToTwip(0.79)   // 2.0 cm (20 mm)
};
