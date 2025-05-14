
import { 
  Paragraph, 
  TextRun, 
  AlignmentType,
  Table,
  ImageRun
} from "docx";
import { ReportData } from "../../types/report";
import { formatDate, formatDateTime } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";
import { 
  getHeading1Style,
  getHeading2Style,
  getNormalStyle,
  getFirstLineIndentStyle,
  SPACING,
  FONTS,
  createDataTable,
  createOfficersDataTable,
  createImageTable
} from "./styles";

/**
 * Creates the header and title sections of the document
 */
export const createHeaderSection = (reportData: ReportData): Paragraph[] => {
  return [
    // Add double spacing before title
    new Paragraph({
      spacing: { before: SPACING.BEFORE.DOUBLE, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    
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
  
  // Create officers table with officers displayed on separate lines
  const officersTable = createOfficersDataTable(reportData.officers);

  return [
    // Spacing before table
    new Paragraph({
      spacing: { before: SPACING.BEFORE.STANDARD, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    
    // Introduction text with first line indent
    getFirstLineIndentStyle(getIntroductoryText(reportData).replace(/<[^>]*>/g, '')),
    
    // Spacing before table
    new Paragraph({
      spacing: { before: SPACING.BEFORE.STANDARD, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    
    // Add metadata table 
    metadataTable,
    
    // Spacing after table
    new Paragraph({
      spacing: { before: SPACING.BEFORE.STANDARD, after: 0 },
      children: [new TextRun({ text: "" })]
    }),
    
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
    getHeading2Style("1. Resumo das Ocorrências")
  ];

  // Check if there are occurrences
  if (reportData.hasOccurrences && reportData.occurrences.length > 0) {
    const occurrencesParagraphs: (Paragraph | Table)[] = [];
    
    reportData.occurrences.forEach(occurrence => {
      // Spacing before table
      occurrencesParagraphs.push(
        new Paragraph({
          spacing: { before: SPACING.BEFORE.STANDARD, after: 0 },
          children: [new TextRun({ text: "" })]
        })
      );
      
      // Create a data table for each occurrence
      const occurrenceTable = createDataTable([
        { label: "Número do RAI", value: occurrence.raiNumber },
        { label: "Natureza da Ocorrência", value: occurrence.nature },
        { label: "Resumo da Ocorrência", value: occurrence.summary },
        { label: "Cartório Responsável", value: occurrence.responsibleOffice }
      ]);
      
      occurrencesParagraphs.push(occurrenceTable);
      
      // Spacing after table
      occurrencesParagraphs.push(
        new Paragraph({
          spacing: { before: SPACING.BEFORE.STANDARD, after: 0 },
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
    getHeading2Style("2. Imagens Relevantes")
  ];
};

/**
 * Creates the conclusions and observations sections
 */
export const createConclusionSection = (reportData: ReportData): Paragraph[] => {
  return [
    // Observations section
    getHeading2Style("3. Observações e Recomendações"),
    getFirstLineIndentStyle(getObservationsText(reportData.observations)),
    
    // Spacing between subsections
    new Paragraph({
      spacing: { after: SPACING.BEFORE.STANDARD },
      children: [new TextRun({ text: "" })]
    }),
    
    // Conclusion
    getHeading2Style("4. Conclusão"),
    getFirstLineIndentStyle("Esta equipe finaliza o presente relatório, permanecendo à disposição para eventuais esclarecimentos."),
    
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
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ 
        text: "__________________________", 
        font: FONTS.TIMES_NEW_ROMAN,
        size: 24
      })]
    }),
    new Paragraph({ 
      spacing: { after: 0 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `${officer.name}`,
          font: FONTS.TIMES_NEW_ROMAN,
          size: 24
        })
      ] 
    }),
    new Paragraph({ 
      spacing: { after: SPACING.AFTER.STANDARD },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ 
          text: `${officer.role}`,
          font: FONTS.TIMES_NEW_ROMAN,
          size: 24
        })
      ] 
    }),
  ]);

  return [...headerParagraph, ...signatureBlocks];
};
