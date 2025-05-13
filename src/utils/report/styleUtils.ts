
/**
 * Styling utilities for document export
 */
import { 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle,
  convertInchesToTwip,
  HeadingLevel,
  ImageRun
} from 'docx';
import { Officer } from '../../types/report';

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
 * Create table with institutional header
 */
export const createInstitutionalHeader = (brasaoEstadoGoias: Uint8Array, brasaoPolicialCivil: Uint8Array) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Left column - Police coat of arms (swapped)
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: brasaoPolicialCivil,
                    transformation: {
                      width: 65,
                      height: 65,
                    },
                    altText: {
                      name: 'Brasão da Polícia Civil',
                      description: 'Brasão da Polícia Civil'
                    },
                    type: 'png'
                  }),
                ],
              }),
            ],
          }),
          // Center column - Institutional info
          new TableCell({
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
            children: [
              ...['ESTADO DE GOIÁS', 
                 'SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA',
                 'POLÍCIA CIVIL',
                 'DELEGACIA ESPECIALIZADA EM INVESTIGAÇÕES DE CRIMES DE',
                 'TRÂNSITO - DICT DE GOIÂNIA'].map(text => 
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text,
                      bold: true,
                      size: 20, // 10pt
                      font: FONTS.TIMES_NEW_ROMAN,
                      color: COLORS.BLACK
                    }),
                  ],
                })
              ),
            ],
          }),
          // Right column - State coat of arms (swapped)
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: brasaoEstadoGoias,
                    transformation: {
                      width: 65,
                      height: 65,
                    },
                    altText: {
                      name: 'Brasão de Goiás',
                      description: 'Brasão do Estado de Goiás'
                    },
                    type: 'png'
                  }),
                ],
              }),
            ],
          }),
        ],
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

/**
 * Create data table with alternating colors 
 */
export const createDataTable = (rows: { label: string; value: string }[]) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
    },
    rows: rows.map(({ label, value }) => 
      new TableRow({
        children: [
          // Label cell
          new TableCell({
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            shading: {
              fill: COLORS.LIGHT_GRAY,
            },
            children: [
              new Paragraph({
                spacing: {
                  before: SPACING.BEFORE.SMALL,
                  after: SPACING.AFTER.SMALL,
                  line: SPACING.LINE.SINGLE
                },
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    size: 24, // 12pt
                    font: FONTS.TIMES_NEW_ROMAN
                  }),
                ],
              }),
            ],
          }),
          // Value cell
          new TableCell({
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
            shading: {
              fill: COLORS.VERY_LIGHT_GRAY,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                  before: SPACING.BEFORE.SMALL,
                  after: SPACING.AFTER.SMALL,
                  line: SPACING.LINE.SINGLE
                },
                children: [
                  new TextRun({
                    text: value,
                    size: 24, // 12pt
                    font: FONTS.TIMES_NEW_ROMAN
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  });
};

/**
 * Create officers data table with separate lines for each officer
 */
export const createOfficersDataTable = (officers: Officer[]) => {
  const officersContent = officers.map(officer => 
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: {
        before: 60,
        after: 0,
        line: SPACING.LINE.SINGLE
      },
      bullet: {
        level: 0
      },
      children: [
        new TextRun({
          text: officer.name,
          size: 24, // 12pt
          font: FONTS.TIMES_NEW_ROMAN
        }),
        new TextRun({
          text: "\n",
          size: 24,
          font: FONTS.TIMES_NEW_ROMAN
        }),
        new TextRun({
          text: officer.role,
          size: 24, // 12pt
          font: FONTS.TIMES_NEW_ROMAN
        })
      ],
    })
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.WHITE },
    },
    rows: [
      new TableRow({
        children: [
          // Label cell
          new TableCell({
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            shading: {
              fill: COLORS.LIGHT_GRAY,
            },
            children: [
              new Paragraph({
                spacing: {
                  before: SPACING.BEFORE.SMALL,
                  after: SPACING.AFTER.SMALL,
                  line: SPACING.LINE.SINGLE
                },
                children: [
                  new TextRun({
                    text: "Policiais da Equipe",
                    bold: true,
                    size: 24, // 12pt
                    font: FONTS.TIMES_NEW_ROMAN
                  }),
                ],
              }),
            ],
            verticalAlign: 'top',
          }),
          // Value cell with list of officers
          new TableCell({
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
            shading: {
              fill: COLORS.VERY_LIGHT_GRAY,
            },
            children: officersContent,
          }),
        ],
      })
    ],
  });
};

/**
 * Create image table with border for document
 */
export const createImageTable = (imageData: Uint8Array, caption: string) => {
  return new Table({
    width: {
      size: 90,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
      left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
      right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
    },
    rows: [
      // Image row
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 120,
                  after: 120,
                },
                children: [
                  new ImageRun({
                    data: imageData,
                    transformation: {
                      width: 400,
                      height: 300,
                    }
                  })
                ],
              }),
            ],
          }),
        ],
      }),
      // Caption row
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
              right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.PAGE_BORDER },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 120,
                  after: 120,
                },
                children: [
                  new TextRun({
                    text: caption,
                    italics: true,
                    size: 24,
                    font: FONTS.TIMES_NEW_ROMAN
                  })
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
