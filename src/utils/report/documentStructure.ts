
import { Document, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import { ReportData } from "../../types/report";
import { formatDate } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import { processImageForDocx } from "./imageProcessing";

/**
 * Creates the header and title sections of the document
 */
export const createHeaderSection = (reportData: ReportData): Paragraph[] => {
  return [
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
  ];
};

/**
 * Creates the introduction section of the document
 */
export const createIntroductionSection = (reportData: ReportData): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: getIntroductoryText(reportData).replace(/<[^>]*>/g, ''),
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: " " })] }),
  ];
};

/**
 * Creates the general data section of the document
 */
export const createGeneralDataSection = (reportData: ReportData): Paragraph[] => {
  const paragraphs = [
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
  ];

  // Add officers list
  const officersParagraphs = reportData.officers.map(officer => 
    new Paragraph({
      children: [
        new TextRun({
          text: `- ${officer.name} - ${officer.role}`,
        }),
      ],
    })
  );

  return [
    ...paragraphs, 
    ...officersParagraphs,
    new Paragraph({ children: [new TextRun({ text: " " })] })
  ];
};

/**
 * Creates the occurrences section of the document
 */
export const createOccurrencesSection = (reportData: ReportData): Paragraph[] => {
  const headerParagraph = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Resumo das Ocorrências",
          bold: true,
        }),
      ],
    })
  ];

  // Check if there are occurrences
  if (reportData.hasOccurrences && reportData.occurrences.length > 0) {
    const occurrencesParagraphs = reportData.occurrences.flatMap(occurrence => [
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
    ]);

    return [
      ...headerParagraph,
      ...occurrencesParagraphs,
      new Paragraph({ children: [new TextRun({ text: " " })] })
    ];
  } else {
    return [
      ...headerParagraph,
      new Paragraph({
        children: [
          new TextRun({
            text: "Não houve ocorrências durante o plantão.",
            italics: true,
          }),
        ],
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] })
    ];
  }
};

/**
 * Creates the images section header
 */
export const createImagesSectionHeader = (): Paragraph[] => {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Imagens Relevantes",
          bold: true,
        }),
      ],
    })
  ];
};

/**
 * Creates the conclusions and observations sections
 */
export const createConclusionSection = (reportData: ReportData): Paragraph[] => {
  return [
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
  ];
};

/**
 * Creates the signatures section
 */
export const createSignaturesSection = (reportData: ReportData): Paragraph[] => {
  const headerParagraph = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Assinaturas",
          bold: true,
        }),
      ],
    })
  ];

  const signatureBlocks = reportData.officers.flatMap(officer => [
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
  ]);

  return [...headerParagraph, ...signatureBlocks];
};

/**
 * Process images and create image paragraphs
 */
export const processImagesForDocument = async (reportData: ReportData, documentChildren: Paragraph[]): Promise<Paragraph[]> => {
  const imageParagraphs: Paragraph[] = [];

  if (reportData.images.length > 0) {
    try {
      // Process all images
      for (const [index, image] of reportData.images.entries()) {
        try {
          // Process the image
          const processedImage = await processImageForDocx(
            image.dataUrl,
            image.description,
            index
          );
          
          // Add image description
          imageParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: image.description || `Imagem ${index + 1}`,
                  italics: true,
                }),
              ],
            })
          );
          
          // Fixed ImageRun configuration by adding type property with correct value
          imageParagraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: processedImage.imageData,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                  altText: {
                    name: processedImage.altText.name,
                    description: processedImage.altText.description,
                  },
                  type: "png", // Using 'png' instead of 'image' as it's one of the allowed types
                }),
              ],
            })
          );
          
          // Add spacing after image
          imageParagraphs.push(
            new Paragraph({ children: [new TextRun({ text: " " })] })
          );
        } catch (imageError) {
          console.error("Error processing image:", imageError);
          // Add fallback text noting the error
          imageParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Não foi possível incluir a imagem: ${image.description || "Sem descrição"}]`,
                  italics: true,
                }),
              ],
            })
          );
        }
      }
    } catch (error) {
      console.error("Error processing images:", error);
      imageParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "[Erro ao processar imagens]",
              italics: true,
            }),
          ],
        })
      );
    }
  } else {
    imageParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Sem imagens relevantes",
            italics: true,
          }),
        ],
      })
    );
  }

  return imageParagraphs;
};
