
/**
 * Header and footer styling utilities for document export
 */
import { 
  Paragraph, 
  TextRun, 
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType, 
  BorderStyle,
  ImageRun,
  TableLayoutType,
  VerticalAlign
} from 'docx';
import { FONTS, COLORS } from './constants';

/**
 * Create table with institutional header
 */
export const createInstitutionalHeader = (brasaoEstadoGoias: Uint8Array, brasaoPolicialCivil: Uint8Array) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    layout: TableLayoutType.FIXED, // Fixed layout to prevent Auto-Fit
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
          // Left column - Police coat of arms
          new TableCell({
            width: {
              size: 709, // 2.5 cm in twips (1 cm ≈ 283.5 twips)
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: brasaoPolicialCivil,
                    transformation: {
                      width: 51, // ~1.8 cm (0.7 inches) in points
                      height: 51,
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
              size: 3402, // 12.0 cm in twips
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240 }, // Single line spacing
                children: [
                  new TextRun({
                    text: "ESTADO DE GOIÁS",
                    bold: true,
                    size: 20, // 10pt
                    font: FONTS.TIMES_NEW_ROMAN,
                    color: COLORS.BLACK
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240 },
                children: [
                  new TextRun({
                    text: "SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA",
                    bold: true,
                    size: 20,
                    font: FONTS.TIMES_NEW_ROMAN,
                    color: COLORS.BLACK
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240 },
                children: [
                  new TextRun({
                    text: "POLÍCIA CIVIL",
                    bold: true,
                    size: 20,
                    font: FONTS.TIMES_NEW_ROMAN,
                    color: COLORS.BLACK
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240 },
                children: [
                  new TextRun({
                    text: "DELEGACIA ESPECIALIZADA EM INVESTIGAÇÕES",
                    bold: true,
                    size: 20,
                    font: FONTS.TIMES_NEW_ROMAN,
                    color: COLORS.BLACK
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240 },
                children: [
                  new TextRun({
                    text: "DE CRIMES DE TRÂNSITO - DICT DE GOIÂNIA",
                    bold: true,
                    size: 20,
                    font: FONTS.TIMES_NEW_ROMAN,
                    color: COLORS.BLACK
                  }),
                ],
              }),
            ],
          }),
          // Right column - State coat of arms
          new TableCell({
            width: {
              size: 709, // 2.5 cm in twips
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: brasaoEstadoGoias,
                    transformation: {
                      width: 51, // ~1.8 cm (0.7 inches) in points
                      height: 51,
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
