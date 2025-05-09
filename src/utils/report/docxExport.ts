
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { ReportData } from "../../types/report";
import { formatDate } from "./dateFormatters";
import { getIntroductoryText, getObservationsText } from "./textGenerators";

// Helper function to convert base64 data URL to blob
const base64ToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return await response.blob();
};

// Helper function to convert base64 to Uint8Array (browser-compatible)
const base64ToUint8Array = (base64String: string): Uint8Array => {
  // Remove data URL prefix if present
  const base64 = base64String.split(',')[1] || base64String;
  // Convert base64 to binary string using the browser's atob function
  const binaryString = atob(base64);
  // Create Uint8Array from binary string
  return Uint8Array.from(binaryString, c => c.charCodeAt(0));
};

export async function exportReportToWord(reportData: ReportData): Promise<void> {
  const docChildren = [
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
    
    // Images section header
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Imagens Relevantes",
          bold: true,
        }),
      ],
    }),
  ];

  // Process images - this will be done separately below
  
  // Add the rest of the sections
  const remainingSections = [
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
    ...reportData.officers.flatMap(officer => [
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
    ])
  ];

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  // Handle images - if there are any
  if (reportData.images.length > 0) {
    try {
      // Process all images
      for (const image of reportData.images) {
        try {
          // Convert image to blob
          const blob = await base64ToBlob(image.dataUrl);
          
          // Convert blob to arrayBuffer
          const arrayBuffer = await blob.arrayBuffer();
          
          // Add image description
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: image.description || `Imagem ${reportData.images.indexOf(image) + 1}`,
                  italics: true,
                }),
              ],
            })
          );
          
          // Add the image with proper configuration
          docChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuffer,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                  altText: {
                    name: `image-${reportData.images.indexOf(image) + 1}`,
                    title: image.description || `Image ${reportData.images.indexOf(image) + 1}`,
                    description: image.description || `Image ${reportData.images.indexOf(image) + 1}`,
                  }
                }),
              ],
            })
          );
          
          // Add spacing after image
          docChildren.push(
            new Paragraph({ children: [new TextRun({ text: " " })] })
          );
        } catch (imageError) {
          console.error("Error processing image:", imageError);
          // Add fallback text noting the error
          docChildren.push(
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
      docChildren.push(
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
    docChildren.push(
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

  // Add the remaining sections after the images
  docChildren.push(...remainingSections);

  // Generate the document as a blob directly for browser compatibility
  const blob = await Packer.toBlob(doc);
  const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`;
  saveAs(blob, fileName);
}
