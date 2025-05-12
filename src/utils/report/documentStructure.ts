import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  ImageRun,
  Header,
  PageNumber,
  AlignmentType,
  Footer,
  BorderStyle,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  Table,
  TableRow,
  TableCell,
  WidthType
} from "docx";
import { ReportData } from "../../types/report";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import { processImageForDocx } from "./imageProcessing";
import {
  getHeading1Style,
  getHeading2Style,
  getSectionTitleStyle,
  getNormalStyle,
  MARGINS,
  SPACING,
  COLORS,
  FONTS,
  createDataTable,
  getDocumentFooter,
  createInstitutionalHeader
} from "./styleUtils";

// Placeholder for images that will be loaded
let brasaoEstadoGoias: Buffer;
let brasaoPolicialCivil: Buffer;

/**
 * Load the emblems needed for the document
 */
export const loadEmblems = async (): Promise<void> => {
  try {
    const stateResponse = await fetch('/brasao-goias.png');
    const policeResponse = await fetch('/brasao-policia-civil.png');
    
    brasaoEstadoGoias = Buffer.from(await stateResponse.arrayBuffer());
    brasaoPolicialCivil = Buffer.from(await policeResponse.arrayBuffer());
  } catch (error) {
    console.error("Error loading emblems:", error);
    // Create empty buffers in case of failure
    brasaoEstadoGoias = Buffer.from([]);
    brasaoPolicialCivil = Buffer.from([]);
  }
};

/**
 * Creates the header and title sections of the document
 */
export const createHeaderSection = (reportData: ReportData): Paragraph[] => {
  return [
    // Title and header
    getHeading1Style(`RELATÓRIO DE PLANTÃO ${reportData.reportNumber || ""}`),
    
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: SPACING.BEFORE.STANDARD,
        after: SPACING.AFTER.STANDARD,
      },
      children: [
        new TextRun({
          text: `${formatDate(reportData.reportDate)}`,
          italics: true,
          size: 24,
          font: FONTS.TIMES_NEW_ROMAN
        }),
      ],
    }),
    
    // Add spacing after the header
    new Paragraph({
      spacing: { after: SPACING.SECTION.DOUBLE },
      children: [new TextRun({ text: "" })]
    }),
  ];
};

/**
 * Creates the introduction section of the document
 */
export const createIntroductionSection = (reportData: ReportData): (Paragraph | Table)[] => {
  // Create metadata table
  const metadataTable = createDataTable([
    { label: "Início do Plantão", value: formatDateTime(reportData.startDateTime) },
    { label: "Fim do Plantão", value: formatDateTime(reportData.endDateTime) },
    { label: "Nome da Equipe", value: reportData.teamName },
    { label: "Cartório Responsável", value: reportData.responsibleOffice }
  ]);
  
  // Create officers list text
  const officersText = reportData.officers
    .map(officer => `${officer.name} - ${officer.role}`)
    .join("\n");
  
  const officersTable = createDataTable([
    { label: "Policiais da Equipe", value: officersText }
  ]);

  return [
    // Introduction text
    getNormalStyle(getIntroductoryText(reportData).replace(/<[^>]*>/g, '')),
    
    // Add metadata table 
    metadataTable,
    
    // Add officers table
    officersTable,
    
    // Add spacing after introduction
    new Paragraph({
      spacing: { after: SPACING.SECTION.DOUBLE },
      children: [new TextRun({ text: "" })]
    })
  ];
};

/**
 * Creates the general data section of the document
 */
export const createGeneralDataSection = (reportData: ReportData): Paragraph[] => {
  return [
    getHeading2Style("Dados Gerais"),
    
    getNormalStyle(`Nome da equipe: ${reportData.teamName}`),
    getNormalStyle(`Cartório responsável: ${reportData.responsibleOffice}`),
    getNormalStyle("Policiais da equipe:"),
    
    // Add officers list
    ...reportData.officers.map(officer => 
      getNormalStyle(`- ${officer.name} - ${officer.role}`)
    ),
    
    // Spacing after section
    new Paragraph({
      spacing: { after: SPACING.SECTION.DOUBLE },
      children: [new TextRun({ text: "" })]
    })
  ];
};

/**
 * Creates the occurrences section of the document
 */
export const createOccurrencesSection = (reportData: ReportData): (Paragraph | Table)[] => {
  const headerParagraph = [
    getHeading2Style("Resumo das Ocorrências")
  ];

  // Check if there are occurrences
  if (reportData.hasOccurrences && reportData.occurrences.length > 0) {
    const occurrencesParagraphs: (Paragraph | Table)[] = [];
    
    reportData.occurrences.forEach(occurrence => {
      // Create a data table for each occurrence
      const occurrenceTable = createDataTable([
        { label: "Número do RAI", value: occurrence.raiNumber },
        { label: "Natureza da Ocorrência", value: occurrence.nature },
        { label: "Resumo da Ocorrência", value: occurrence.summary },
        { label: "Cartório Responsável", value: occurrence.responsibleOffice }
      ]);
      
      occurrencesParagraphs.push(occurrenceTable);
      
      // Add spacing between occurrences
      occurrencesParagraphs.push(
        new Paragraph({
          spacing: { after: SPACING.BEFORE.STANDARD },
          children: [new TextRun({ text: "" })]
        })
      );
    });

    return [
      ...headerParagraph,
      ...occurrencesParagraphs,
      // Spacing after section
      new Paragraph({
        spacing: { after: SPACING.SECTION.DOUBLE },
        children: [new TextRun({ text: "" })]
      })
    ];
  } else {
    return [
      ...headerParagraph,
      getNormalStyle("Não houve ocorrências durante o plantão.", { italics: true }),
      // Spacing after section
      new Paragraph({
        spacing: { after: SPACING.SECTION.DOUBLE },
        children: [new TextRun({ text: "" })]
      })
    ];
  }
};

/**
 * Creates the images section header
 */
export const createImagesSectionHeader = (): Paragraph[] => {
  return [
    getHeading2Style("Imagens Relevantes")
  ];
};

/**
 * Creates the conclusions and observations sections
 */
export const createConclusionSection = (reportData: ReportData): Paragraph[] => {
  return [
    // Observations section
    getHeading2Style("Observações e Recomendações"),
    getNormalStyle(getObservationsText(reportData.observations)),
    
    // Spacing between subsections
    new Paragraph({
      spacing: { after: SPACING.BEFORE.STANDARD },
      children: [new TextRun({ text: "" })]
    }),
    
    // Conclusion
    getHeading2Style("Conclusão"),
    getNormalStyle("Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos."),
    
    // Spacing after section
    new Paragraph({
      spacing: { after: SPACING.SECTION.DOUBLE },
      children: [new TextRun({ text: "" })]
    }),
  ];
};

/**
 * Creates the signatures section
 */
export const createSignaturesSection = (reportData: ReportData): Paragraph[] => {
  const headerParagraph = [
    getHeading2Style("Assinaturas")
  ];

  const signatureBlocks = reportData.officers.flatMap(officer => [
    new Paragraph({ 
      spacing: { before: SPACING.BEFORE.HEADING, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    new Paragraph({ 
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    new Paragraph({ 
      spacing: { after: 0 },
      children: [new TextRun({ 
        text: "__________________________", 
        font: FONTS.TIMES_NEW_ROMAN,
        size: 24
      })]
    }),
    new Paragraph({ 
      spacing: { after: SPACING.AFTER.STANDARD },
      children: [
        new TextRun({ 
          text: `${officer.name} - ${officer.role}`,
          font: FONTS.TIMES_NEW_ROMAN,
          size: 24
        })
      ] 
    }),
  ]);

  return [...headerParagraph, ...signatureBlocks];
};

/**
 * Process images and create image paragraphs
 */
export const processImagesForDocument = async (reportData: ReportData): Promise<(Paragraph | Table)[]> => {
  const imageParagraphs: (Paragraph | Table)[] = [];

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
          
          // Create a table for the image and its description
          const imageTable = new Table({
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
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
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
                            type: "png", 
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              // Description row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: {
                          before: SPACING.BEFORE.SMALL,
                          after: SPACING.AFTER.SMALL,
                        },
                        children: [
                          new TextRun({
                            text: image.description || `Imagem ${index + 1}`,
                            italics: true,
                            size: 24,
                            font: FONTS.TIMES_NEW_ROMAN
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
          
          imageParagraphs.push(imageTable);
          
          // Add spacing after image table
          imageParagraphs.push(
            new Paragraph({ 
              spacing: { after: SPACING.BEFORE.STANDARD },
              children: [new TextRun({ text: "" })]
            })
          );
          
        } catch (imageError) {
          console.error("Error processing image:", imageError);
          // Add fallback text noting the error
          imageParagraphs.push(
            getNormalStyle(`[Não foi possível incluir a imagem: ${image.description || "Sem descrição"}]`, { italics: true })
          );
        }
      }
    } catch (error) {
      console.error("Error processing images:", error);
      imageParagraphs.push(
        getNormalStyle("[Erro ao processar imagens]", { italics: true })
      );
    }
  } else {
    imageParagraphs.push(
      getNormalStyle("Sem imagens relevantes", { italics: true })
    );
  }
  
  // Add spacing after the images section
  imageParagraphs.push(
    new Paragraph({
      spacing: { after: SPACING.SECTION.DOUBLE },
      children: [new TextRun({ text: "" })]
    })
  );

  return imageParagraphs;
};

/**
 * Get the document section with margins and styling for Word
 */
export const getDocumentSection = (children: (Paragraph | Table)[], hasHeadersAndFooters: boolean = true) => {
  const section: any = {
    properties: {
      page: {
        margin: {
          top: MARGINS.TOP,
          right: MARGINS.RIGHT,
          bottom: MARGINS.BOTTOM,
          left: MARGINS.LEFT,
        },
        borders: {
          pageBorders: {
            display: PageBorderDisplay.ALL_PAGES,
            offsetFrom: PageBorderOffsetFrom.PAGE,
            zOrder: PageBorderZOrder.BACK,
          },
          top: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          right: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
          left: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: COLORS.PAGE_BORDER,
          },
        },
      },
    },
    children: children,
  };

  // Add the institutional header and confidential footer if requested
  if (hasHeadersAndFooters && brasaoEstadoGoias && brasaoPolicialCivil) {
    section.headers = {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
                font: FONTS.TIMES_NEW_ROMAN,
                size: 20, // 10pt
              }),
            ],
          }),
          createInstitutionalHeader(brasaoEstadoGoias, brasaoPolicialCivil),
          // Add spacing after header
          new Paragraph({
            spacing: { after: SPACING.SECTION.DOUBLE },
            children: [new TextRun({ text: "" })]
          })
        ],
      }),
    };
    
    section.footers = {
      default: new Footer({
        children: [getDocumentFooter()],
      }),
    };
  }
  
  return section;
};
