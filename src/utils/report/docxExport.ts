
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { formatDate } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";

export async function exportReportToWord(reportData: ReportData): Promise<void> {
  // Create document with proper structure and all content
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title and header
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: "center",
            children: [
              new TextRun({
                text: `Relatório de Plantão ${reportData.reportNumber || ""}`,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            alignment: "center",
            children: [
              new TextRun({
                text: `${formatDate(reportData.reportDate)}`,
                italics: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Introduction section
          new Paragraph({
            children: [
              new TextRun({
                text: getIntroductoryText(reportData).replace(/<[^>]*>/g, ''),
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // General data section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Dados Gerais",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Nome da equipe: ${reportData.teamName}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Cartório responsável: ${reportData.responsibleOffice}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Policiais da equipe:",
              }),
            ],
          }),
          // Officers list
          ...reportData.officers.map(officer => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `- ${officer.name} - ${officer.role}`,
                }),
              ],
            })
          ),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Occurrences section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Resumo das Ocorrências",
                bold: true,
              }),
            ],
          }),
          // Occurrences content
          ...(reportData.hasOccurrences && reportData.occurrences.length > 0
            ? [
                ...reportData.occurrences.flatMap(occurrence => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Número do RAI: ${occurrence.raiNumber}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Natureza da Ocorrência: ${occurrence.nature}`,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Resumo da Ocorrência: ${occurrence.summary}`,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Cartório Responsável: ${occurrence.responsibleOffice}`,
                      }),
                    ],
                  }),
                  new Paragraph({ children: [new TextRun({ text: " " })] }),
                ]),
              ]
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Não houve ocorrências durante o plantão.",
                      italics: true,
                    }),
                  ],
                }),
              ]
          ),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Images section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Imagens Relevantes",
                bold: true,
              }),
            ],
          }),
          
          // Images content
          ...(reportData.images.length > 0
            ? reportData.images.flatMap(image => {
                // For each image, add a descriptive text
                return [
                  new Paragraph({ 
                    children: [
                      new TextRun({ 
                        text: image.description || `Imagem ${reportData.images.indexOf(image) + 1}`,
                        italics: true
                      })
                    ] 
                  }),
                  new Paragraph({ children: [new TextRun({ text: " " })] }),
                ];
              })
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Sem imagens relevantes",
                      italics: true,
                    }),
                  ],
                }),
              ]
          ),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Observations section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Observações e Recomendações",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: getObservationsText(reportData.observations),
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Conclusion
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Conclusão",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos.",
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }),
          
          // Signatures section
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Assinaturas",
                bold: true,
              }),
            ],
          }),
          
          // Add signature blocks for each officer
          ...reportData.officers.map(officer => [
            new Paragraph({ children: [new TextRun({ text: " " })] }),
            new Paragraph({ children: [new TextRun({ text: " " })] }),
            new Paragraph({ children: [new TextRun({ text: "__________________________" })] }),
            new Paragraph({ 
              children: [
                new TextRun({ 
                  text: `${officer.name} - ${officer.role}`
                })
              ] 
            }),
          ]).flat()
        ],
      },
    ],
  });

  // Generate the document as a blob directly for browser compatibility
  const blob = await Packer.toBlob(doc);
  const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`;
  saveAs(blob, fileName);
}
