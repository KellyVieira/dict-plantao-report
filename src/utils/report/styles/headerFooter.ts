
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
  ImageRun
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
