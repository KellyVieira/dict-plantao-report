
import { useState, useRef } from "react";
import { useReport } from "../contexts/ReportContext";
import { Button } from "@/components/ui/button";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import { 
  generateFullReportHTML, 
  formatDate, 
  formatDateTime,
  getIntroductoryText,
  getObservationsText,
  getSignatureBlocks
} from "../utils/report";
import { Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from "docx";
import { saveAs } from "file-saver";

const ReportExport = () => {
  const { reportData } = useReport();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportHtmlRef = useRef<HTMLDivElement>(null);
  const reportHtml = generateFullReportHTML(reportData);

  const handleViewReport = () => {
    setShowPreview(true);
  };

  const exportToWord = async () => {
    setIsExporting(true);
    toast({
      title: "Exportando DOCX",
      description: "Por favor, aguarde enquanto o arquivo é gerado..."
    });

    try {
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
                    // For each image, we'll try to add it to the document
                    try {
                      // For demonstration, we're not actually adding images as it requires binary data
                      // Instead, we're adding placeholders with the descriptions
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
                    } catch (error) {
                      console.error("Error adding image:", error);
                      return [
                        new Paragraph({ 
                          children: [new TextRun({ text: `[Imagem não pôde ser incluída]` })] 
                        }),
                        new Paragraph({ children: [new TextRun({ text: " " })] }),
                      ];
                    }
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
      Packer.toBlob(doc).then(blob => {
        const fileName = `Relatório_Plantão_${reportData.reportNumber || "DICT"}.docx`;
        saveAs(blob, fileName);
        
        toast({
          title: "DOCX exportado com sucesso!",
          description: "O arquivo foi baixado para o seu dispositivo."
        });
      }).catch(error => {
        console.error("Erro ao gerar DOCX:", error);
        toast({
          title: "Erro na exportação",
          description: "Não foi possível gerar o arquivo DOCX. Tente novamente.",
          variant: "destructive"
        });
      }).finally(() => {
        setIsExporting(false);
      });
    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo DOCX. Tente novamente.",
        variant: "destructive"
      });
      setIsExporting(false);
    }
  };

  return (
    <PageContainer title="Visualização e Exportação do Relatório">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center pb-6">
          <Button 
            className="bg-police-blue hover:bg-police-lightblue flex-1 gap-2 py-6" 
            onClick={handleViewReport}
            disabled={isExporting}
          >
            <Eye className="h-5 w-5" />
            Visualizar Relatório
          </Button>
          
          <Button 
            className="bg-blue-700 hover:bg-blue-800 flex-1 gap-2 py-6" 
            onClick={exportToWord}
            disabled={isExporting}
          >
            <FileText className="h-5 w-5" />
            Exportar .DOCX
          </Button>
        </div>

        {showPreview && (
          <div className="border rounded-lg shadow-lg p-6 bg-white">
            <div 
              ref={reportHtmlRef} 
              className="relative"
              dangerouslySetInnerHTML={{ __html: reportHtml }} 
            />
          </div>
        )}
        
        {!showPreview && (
          <div className="text-center p-10 border border-dashed rounded-md">
            <p className="text-gray-500 mb-4">
              Clique em "Visualizar Relatório" para ver a prévia do documento final.
            </p>
            <div className="flex flex-col space-y-2 max-w-md mx-auto text-left bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-center">Resumo do Relatório</h3>
              <p><strong>Número:</strong> {reportData.reportNumber || "Não definido"}</p>
              <p><strong>Data:</strong> {formatDate(reportData.reportDate)}</p>
              <p><strong>Período:</strong> {formatDateTime(reportData.startDateTime)} a {formatDateTime(reportData.endDateTime)}</p>
              <p><strong>Equipe:</strong> {reportData.teamName || "Não definida"}</p>
              <p><strong>Cartório responsável:</strong> {reportData.responsibleOffice || "Não definido"}</p>
              <p><strong>Ocorrências registradas:</strong> {reportData.hasOccurrences ? reportData.occurrences.length : "Nenhuma"}</p>
              <p><strong>Imagens anexadas:</strong> {reportData.images.length}</p>
            </div>
          </div>
        )}
      </div>

      <PageNavigation prevPage="/images-notes" />
    </PageContainer>
  );
};

export default ReportExport;
