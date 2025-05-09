
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import {
  createHeaderSection,
  createIntroductionSection,
  createGeneralDataSection,
  createOccurrencesSection,
  createImagesSectionHeader,
  createConclusionSection,
  createSignaturesSection,
  processImagesForDocument
} from "./documentStructure";

/**
 * Exports the report data to a Word document
 */
export async function exportReportToWord(reportData: ReportData): Promise<void> {
  // Create an array to store all paragraphs
  const docChildren = [
    ...createHeaderSection(reportData),
    ...createIntroductionSection(reportData),
    ...createGeneralDataSection(reportData),
    ...createOccurrencesSection(reportData),
    ...createImagesSectionHeader()
  ];

  // Process images
  const imageParagraphs = await processImagesForDocument(reportData, docChildren);
  docChildren.push(...imageParagraphs);

  // Add conclusion and signatures
  docChildren.push(
    ...createConclusionSection(reportData),
    ...createSignaturesSection(reportData)
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  // Generate the document as a blob directly for browser compatibility
  const blob = await Packer.toBlob(doc);
  const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`;
  saveAs(blob, fileName);
}
