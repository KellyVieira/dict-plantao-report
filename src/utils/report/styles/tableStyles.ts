
/**
 * Table styling utilities for document export
 */
import { 
  Table, 
  TableRow, 
  TableCell, 
  Paragraph,
  TextRun,
  AlignmentType,
  WidthType, 
  BorderStyle,
  ImageRun
} from 'docx';
import type { PoliceOfficer } from '../../../types/report';
import { COLORS, FONTS, SPACING } from './constants';

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
export const createOfficersDataTable = (officers: PoliceOfficer[]) => {
  const officersContent = officers.flatMap(officer => [
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
  ]);

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
export const createImageTable = (imageData: ArrayBuffer, caption: string) => {
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
                    data: new Uint8Array(imageData),
                    transformation: {
                      width: 400,
                      height: 300,
                    },
                    type: 'png'
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
