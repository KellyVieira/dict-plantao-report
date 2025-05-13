
import { Paragraph, ImageRun, AlignmentType, Table } from "docx";
import { ReportData } from "../../types/report";
import { processImageForDocx } from "./imageProcessing";
import { createImageTable } from "./styles/tableStyles";

/**
 * Process all images for the document
 */
export async function processImagesForDocument(reportData: ReportData): Promise<(Paragraph | Table)[]> {
  // If no images, return placeholder paragraph
  if (!reportData.images || reportData.images.length === 0) {
    return [
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "Sem imagens relevantes",
            italics: true,
          }),
        ],
      }),
    ];
  }

  // Create array to store processed image elements
  const imageElements: (Paragraph | Table)[] = [];
  
  // Process each image
  for (const [index, image] of reportData.images.entries()) {
    try {
      // Process the image from data URL to docx format
      const processedImage = await processImageForDocx(
        image.dataUrl, 
        image.description || `Imagem ${index + 1}`,
        index
      );
      
      if (!processedImage) continue;
      
      // Create a bordered table for the image with proper centering
      const imageTable = createImageTable(
        processedImage.imageData,
        image.description || `Imagem ${index + 1}`
      );
      
      imageElements.push(imageTable);
      
      // Add spacing after each image
      imageElements.push(
        new Paragraph({
          spacing: { after: 240 },
          children: [new TextRun({ text: "" })],
        })
      );
      
    } catch (error) {
      console.error(`Error processing image ${index}:`, error);
      // Add error placeholder
      imageElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Erro ao processar imagem ${index + 1}]`,
              italics: true,
            }),
          ],
        })
      );
    }
  }

  return imageElements;
}
