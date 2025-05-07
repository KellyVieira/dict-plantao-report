
import { useState } from "react";
import { useReport } from "../contexts/ReportContext";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const natureOptions = [
  "Homicídio culposo no trânsito",
  "Lesão corporal culposa no trânsito",
  "Embriaguez ao volante",
  "Sinistro de trânsito com dano material",
  "Fuga do local do acidente",
  "Direção perigosa",
  "Racha/competição não autorizada",
  "Outro",
];

const officeOptions = ["Cartório 1", "Cartório 2", "Cartório 3"];

const Occurrences = () => {
  const { 
    reportData, 
    updateReportData, 
    addOccurrence, 
    updateOccurrence, 
    removeOccurrence 
  } = useReport();
  
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    if (!reportData.hasOccurrences) {
      // If no occurrences, just proceed
      return true;
    }
    
    // Check if there is at least one occurrence and all fields are filled
    if (reportData.occurrences.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Você indicou que houve ocorrências, mas não adicionou nenhuma."
      });
      return false;
    }
    
    const errors: Record<string, boolean> = {};
    
    reportData.occurrences.forEach((occurrence, index) => {
      if (!occurrence.raiNumber) {
        errors[`raiNumber-${occurrence.id}`] = true;
      }
      if (!occurrence.nature) {
        errors[`nature-${occurrence.id}`] = true;
      }
      if (!occurrence.summary) {
        errors[`summary-${occurrence.id}`] = true;
      }
      if (!occurrence.responsibleOffice) {
        errors[`responsibleOffice-${occurrence.id}`] = true;
      }
    });
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return false;
    }
    
    return true;
  };

  // Add first occurrence if none exists and hasOccurrences is set to true
  const handleHasOccurrencesChange = (value: string) => {
    const hasOccurrences = value === "true";
    updateReportData({ hasOccurrences });
    
    if (hasOccurrences && reportData.occurrences.length === 0) {
      addOccurrence();
    }
  };

  return (
    <PageContainer title="Registro de Ocorrências">
      <form className="space-y-6">
        <div className="space-y-3">
          <Label>Houve registros de ocorrências durante o plantão?</Label>
          <RadioGroup
            value={reportData.hasOccurrences ? "true" : "false"}
            onValueChange={handleHasOccurrencesChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="no-occurrences" />
              <Label htmlFor="no-occurrences">Não houve ocorrências durante o plantão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="has-occurrences" />
              <Label htmlFor="has-occurrences">Houve ocorrência registrada</Label>
            </div>
          </RadioGroup>
        </div>

        {reportData.hasOccurrences && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Detalhes das Ocorrências</h2>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addOccurrence} 
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar nova ocorrência
              </Button>
            </div>
            
            {reportData.occurrences.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500">
                  Nenhuma ocorrência adicionada. Clique no botão acima para adicionar.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reportData.occurrences.map((occurrence, index) => (
                  <div 
                    key={occurrence.id} 
                    className="p-4 bg-gray-50 rounded-md border relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOccurrence(occurrence.id)}
                      className="absolute right-2 top-2 h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <h3 className="font-medium mb-4">Ocorrência {index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`raiNumber-${occurrence.id}`}>Número do RAI *</Label>
                        <Input
                          id={`raiNumber-${occurrence.id}`}
                          value={occurrence.raiNumber}
                          onChange={(e) => updateOccurrence(occurrence.id, { raiNumber: e.target.value })}
                          placeholder="Ex: 12345-2023"
                          className={formErrors[`raiNumber-${occurrence.id}`] ? "border-red-500" : ""}
                        />
                        {formErrors[`raiNumber-${occurrence.id}`] && (
                          <p className="text-red-500 text-sm">Campo obrigatório</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`nature-${occurrence.id}`}>Natureza da ocorrência *</Label>
                        <Select
                          value={occurrence.nature}
                          onValueChange={(value) => updateOccurrence(occurrence.id, { nature: value })}
                        >
                          <SelectTrigger 
                            className={formErrors[`nature-${occurrence.id}`] ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Selecione a natureza" />
                          </SelectTrigger>
                          <SelectContent>
                            {natureOptions.map((nature) => (
                              <SelectItem key={nature} value={nature}>
                                {nature}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors[`nature-${occurrence.id}`] && (
                          <p className="text-red-500 text-sm">Campo obrigatório</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <Label htmlFor={`summary-${occurrence.id}`}>Resumo da ocorrência *</Label>
                      <Textarea
                        id={`summary-${occurrence.id}`}
                        value={occurrence.summary}
                        onChange={(e) => updateOccurrence(occurrence.id, { summary: e.target.value })}
                        placeholder="Descreva brevemente os detalhes da ocorrência..."
                        className={`min-h-[100px] ${
                          formErrors[`summary-${occurrence.id}`] ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors[`summary-${occurrence.id}`] && (
                        <p className="text-red-500 text-sm">Campo obrigatório</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`responsibleOffice-${occurrence.id}`}>
                        Cartório responsável pela ocorrência *
                      </Label>
                      <Select
                        value={occurrence.responsibleOffice}
                        onValueChange={(value) => 
                          updateOccurrence(occurrence.id, { responsibleOffice: value })
                        }
                      >
                        <SelectTrigger 
                          className={
                            formErrors[`responsibleOffice-${occurrence.id}`] ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Selecione o cartório" />
                        </SelectTrigger>
                        <SelectContent>
                          {officeOptions.map((office) => (
                            <SelectItem key={office} value={office}>
                              {office}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors[`responsibleOffice-${occurrence.id}`] && (
                        <p className="text-red-500 text-sm">Campo obrigatório</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      <PageNavigation 
        prevPage="/initial-info" 
        nextPage="/images-notes" 
        onNext={validateForm} 
      />
    </PageContainer>
  );
};

export default Occurrences;
