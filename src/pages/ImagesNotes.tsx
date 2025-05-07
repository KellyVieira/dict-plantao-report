
import { useRef } from "react";
import { useReport } from "../contexts/ReportContext";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Upload, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImagesNotes = () => {
  const { reportData, updateReportData, addImage, updateImageDescription, removeImage } = useReport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          addImage(file);
        }
      });
      // Reset the file input so the same file can be selected again if removed
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageContainer title="Imagens e Observações">
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="images">Imagens Relevantes</Label>
            <Button 
              type="button" 
              variant="outline" 
              className="gap-2" 
              onClick={handleUploadClick}
            >
              <Upload className="h-4 w-4" /> Enviar Imagens
            </Button>
          </div>
          
          <Input
            id="images"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          
          {reportData.images.length === 0 ? (
            <div className="border border-dashed rounded-md p-10 text-center">
              <div className="flex flex-col items-center">
                <Image className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">Clique no botão acima para enviar imagens</p>
                <p className="text-gray-400 text-sm mt-1">
                  Se não enviar imagens, o relatório incluirá "Sem imagens relevantes"
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                {reportData.images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative">
                      <img 
                        src={image.dataUrl} 
                        alt="Imagem enviada" 
                        className="w-full h-48 object-cover" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <Label htmlFor={`image-desc-${image.id}`} className="mb-1 block">
                        Descrição da imagem
                      </Label>
                      <Textarea
                        id={`image-desc-${image.id}`}
                        value={image.description}
                        onChange={(e) => updateImageDescription(image.id, e.target.value)}
                        placeholder="Descreva esta imagem..."
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="observations">Observações e Recomendações</Label>
          <Textarea
            id="observations"
            value={reportData.observations}
            onChange={(e) => updateReportData({ observations: e.target.value })}
            placeholder="Adicione observações importantes ou recomendações para a equipe seguinte..."
            className="min-h-[150px]"
          />
          <p className="text-gray-500 text-sm">
            Se nenhuma observação for preenchida, o relatório incluirá automaticamente: 
            "Não há informações dignas de nota decorrentes do Plantão ora documentado."
          </p>
        </div>
      </form>

      <PageNavigation prevPage="/occurrences" nextPage="/report-export" />
    </PageContainer>
  );
};

export default ImagesNotes;
