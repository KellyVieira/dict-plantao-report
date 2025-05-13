
/**
 * Paragraph styling utilities for document export
 */
import { 
  Paragraph, 
  TextRun, 
  AlignmentType,
  HeadingLevel
} from 'docx';
import { FONTS, SPACING, COLORS, INDENTATION } from './constants';

/**
 * Styles for document headers
 */
export const getHeading1Style = (text: string) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: {
      before: SPACING.BEFORE.HEADING,
      after: SPACING.AFTER.HEADING,
      line: SPACING.LINE.SINGLE
    },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 28, // 14pt
        font: FONTS.TIMES_NEW_ROMAN,
        color: COLORS.BLACK
      }),
    ],
  });
};

export const getHeading2Style = (text: string) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: SPACING.BEFORE.HEADING,
      after: SPACING.AFTER.HEADING,
      line: SPACING.LINE.SINGLE
    },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 24, // 12pt
        font: FONTS.TIMES_NEW_ROMAN,
        color: COLORS.BLACK
      }),
    ],
  });
};

export const getSectionTitleStyle = (text: string) => {
  return new Paragraph({
    spacing: {
      before: SPACING.BEFORE.HEADING,
      after: SPACING.AFTER.HEADING,
      line: SPACING.LINE.SINGLE
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24, // 12pt
        font: FONTS.TIMES_NEW_ROMAN,
        color: COLORS.BLACK
      }),
    ],
  });
};

/**
 * Style for normal text paragraphs
 */
export const getNormalStyle = (text: string, options: { italics?: boolean } = {}) => {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: {
      before: SPACING.BEFORE.STANDARD,
      after: SPACING.AFTER.STANDARD,
      line: SPACING.LINE.ONE_HALF
    },
    children: [
      new TextRun({
        text: text,
        size: 24, // 12pt
        font: FONTS.TIMES_NEW_ROMAN,
        italics: options.italics
      }),
    ],
  });
};

/**
 * Style for paragraphs with first line indentation
 */
export const getFirstLineIndentStyle = (text: string, options: { italics?: boolean } = {}) => {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: {
      before: SPACING.BEFORE.STANDARD,
      after: SPACING.AFTER.STANDARD,
      line: SPACING.LINE.ONE_HALF
    },
    indent: {
      firstLine: INDENTATION.FIRST_LINE
    },
    children: [
      new TextRun({
        text: text,
        size: 24, // 12pt
        font: FONTS.TIMES_NEW_ROMAN,
        italics: options.italics
      }),
    ],
  });
};

/**
 * Create footer with confidentiality notice
 */
export const getDocumentFooter = () => {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: SPACING.BEFORE.SMALL,
      after: SPACING.AFTER.SMALL,
      line: SPACING.LINE.SINGLE
    },
    children: [
      new TextRun({
        text: 'DOCUMENTO RESERVADO - DICT',
        bold: true,
        color: COLORS.RED,
        size: 16, // 8pt
        font: FONTS.TIMES_NEW_ROMAN
      }),
    ],
  });
};
