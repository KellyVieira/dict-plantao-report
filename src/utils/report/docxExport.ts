
import { Document, Packer, Table, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import {
  createHeaderSection,
  createIntroductionSection,
  createOccurrencesSection,
  createImagesSectionHeader,
  createConclusionSection,
  createSignaturesSection,
  processImagesForDocument,
  loadEmblems,
  getDocumentSection
} from "./documentStructure";

/**
 * Exports the report data to a Word document
 */
export async function exportReportToWord(reportData: ReportData): Promise<void> {
  try {
    // First, load the emblems needed for the institutional header
    console.log("Starting document export process");
    await loadEmblems();
    
    // Create an array to store all content elements (paragraphs or tables)
    const docChildren: (Paragraph | Table)[] = [
      ...createHeaderSection(reportData),
      ...createIntroductionSection(reportData),
    ];

    // Add occurrences section
    const occurrencesSection = createOccurrencesSection(reportData);
    docChildren.push(...occurrencesSection);

    // Add images section header
    docChildren.push(...createImagesSectionHeader());

    // Process images
    const imageParagraphs = await processImagesForDocument(reportData);
    docChildren.push(...imageParagraphs);

    // Add conclusion and signatures
    docChildren.push(
      ...createConclusionSection(reportData),
      ...createSignaturesSection(reportData)
    );

    console.log("Document content prepared");

    // Create document with proper section formatting
    const doc = new Document({
      sections: [
        getDocumentSection(docChildren, true)
      ],
    });

    console.log("Document object created");

    // Generate the document as a blob directly for browser compatibility
    const blob = await Packer.toBlob(doc);
    const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`;
    saveAs(blob, fileName);
    console.log("Document saved successfully");
  } catch (error) {
    console.error("Error in document export process:", error);
    throw error;
  }
}
