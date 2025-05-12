
import { 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle,
  WidthType,
  AlignmentType,
  ImageRun
} from "docx";
import { ReportData } from "../../types/report";
import { processImageForDocx } from "./imageProcessing";
import { SPACING, COLORS, FONTS } from "./styleUtils";

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
            new Paragraph({
              spacing: {
                before: SPACING.BEFORE.STANDARD,
                after: SPACING.AFTER.STANDARD,
                line: SPACING.LINE.ONE_HALF
              },
              children: [
                new TextRun({
                  text: `[Não foi possível incluir a imagem: ${image.description || "Sem descrição"}]`,
                  italics: true,
                  size: 24,
                  font: FONTS.TIMES_NEW_ROMAN
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
          spacing: {
            before: SPACING.BEFORE.STANDARD,
            after: SPACING.AFTER.STANDARD,
            line: SPACING.LINE.ONE_HALF
          },
          children: [
            new TextRun({
              text: "[Erro ao processar imagens]",
              italics: true,
              size: 24,
              font: FONTS.TIMES_NEW_ROMAN
            }),
          ],
        })
      );
    }
  } else {
    imageParagraphs.push(
      new Paragraph({
        spacing: {
          before: SPACING.BEFORE.STANDARD,
          after: SPACING.AFTER.STANDARD,
          line: SPACING.LINE.ONE_HALF
        },
        children: [
          new TextRun({
            text: "Sem imagens relevantes",
            italics: true,
            size: 24,
            font: FONTS.TIMES_NEW_ROMAN
          }),
        ],
      })
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
