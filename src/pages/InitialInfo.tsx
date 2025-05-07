
import { useState, useEffect } from "react";
import { useReport } from "../contexts/ReportContext";
import PageContainer from "../components/PageContainer";
import PageNavigation from "../components/PageNavigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const policeRoles = [
  "Delegado",
  "Escrivão",
  "Agente",
  "Papiloscopista",
  "Perito Criminal",
  "Auxiliar Policial",
  "Médico Legista",
  "Odonto Legista",
];

const officeOptions = ["Cartório 1", "Cartório 2", "Cartório 3"];

const InitialInfo = () => {
  const { reportData, updateReportData, addOfficer, updateOfficer, removeOfficer } = useReport();
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({
    reportNumber: false,
    startDateTime: false,
    endDateTime: false,
    teamName: false,
    responsibleOffice: false,
    officers: false,
  });

  // Add default officer if none exists
  useEffect(() => {
    if (reportData.officers.length === 0) {
      addOfficer();
    }
  }, [reportData.officers.length, addOfficer]);

  const validateForm = () => {
    const errors = {
      reportNumber: !reportData.reportNumber,
      startDateTime: !reportData.startDateTime,
      endDateTime: !reportData.endDateTime,
      teamName: !reportData.teamName,
      responsibleOffice: !reportData.responsibleOffice,
      officers: reportData.officers.some(officer => !officer.name || !officer.role) || 
                reportData.officers.length === 0,
    };

    setFormErrors(errors);
    
    if (Object.values(errors).some(error => error)) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return false;
    }
    
    return true;
  };

  return (
    <PageContainer title="Dados Iniciais do Plantão">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="reportDate">Data do relatório</Label>
            <Input 
              id="reportDate"
              type="date"
              value={reportData.reportDate}
              onChange={(e) => updateReportData({ reportDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportNumber">Número do relatório *</Label>
            <Input 
              id="reportNumber" 
              type="text" 
              placeholder="Ex: 01/2025"
              value={reportData.reportNumber}
              onChange={(e) => updateReportData({ reportNumber: e.target.value })}
              className={formErrors.reportNumber ? "border-red-500" : ""}
            />
            {formErrors.reportNumber && (
              <p className="text-red-500 text-sm">Campo obrigatório</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDateTime">Data e hora de início do plantão *</Label>
            <Input 
              id="startDateTime" 
              type="datetime-local"
              value={reportData.startDateTime}
              onChange={(e) => updateReportData({ startDateTime: e.target.value })}
              className={formErrors.startDateTime ? "border-red-500" : ""}
            />
            {formErrors.startDateTime && (
              <p className="text-red-500 text-sm">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDateTime">Data e hora de término do plantão *</Label>
            <Input 
              id="endDateTime" 
              type="datetime-local"
              value={reportData.endDateTime}
              onChange={(e) => updateReportData({ endDateTime: e.target.value })}
              className={formErrors.endDateTime ? "border-red-500" : ""}
            />
            {formErrors.endDateTime && (
              <p className="text-red-500 text-sm">Campo obrigatório</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="teamName">Nome da equipe *</Label>
            <Input 
              id="teamName" 
              placeholder="Ex: Equipe Alpha"
              value={reportData.teamName}
              onChange={(e) => updateReportData({ teamName: e.target.value })}
              className={formErrors.teamName ? "border-red-500" : ""}
            />
            {formErrors.teamName && (
              <p className="text-red-500 text-sm">Campo obrigatório</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibleOffice">Cartório responsável *</Label>
            <Select
              value={reportData.responsibleOffice}
              onValueChange={(value) => updateReportData({ responsibleOffice: value })}
            >
              <SelectTrigger 
                className={formErrors.responsibleOffice ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione um cartório" />
              </SelectTrigger>
              <SelectContent>
                {officeOptions.map((office) => (
                  <SelectItem key={office} value={office}>
                    {office}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.responsibleOffice && (
              <p className="text-red-500 text-sm">Campo obrigatório</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Lista de policiais da equipe *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOfficer} className="gap-1">
              <Plus className="h-4 w-4" /> Adicionar policial
            </Button>
          </div>
          
          {formErrors.officers && (
            <p className="text-red-500 text-sm">Preencha todos os dados dos policiais</p>
          )}

          <div className="space-y-4">
            {reportData.officers.map((officer, index) => (
              <div key={officer.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-md relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOfficer(officer.id)}
                  className="absolute right-2 top-2 h-6 w-6"
                  disabled={reportData.officers.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  <Label htmlFor={`officerName-${index}`} className="mb-2 block">Nome</Label>
                  <Input
                    id={`officerName-${index}`}
                    placeholder="Nome completo"
                    value={officer.name}
                    onChange={(e) => updateOfficer(officer.id, { name: e.target.value })}
                    className={!officer.name && formErrors.officers ? "border-red-500" : ""}
                  />
                </div>

                <div className="flex-1">
                  <Label htmlFor={`officerRole-${index}`} className="mb-2 block">Cargo</Label>
                  <Select
                    value={officer.role}
                    onValueChange={(value) => updateOfficer(officer.id, { role: value })}
                  >
                    <SelectTrigger 
                      className={!officer.role && formErrors.officers ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {policeRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      <PageNavigation prevPage="/" nextPage="/occurrences" onNext={validateForm} />
    </PageContainer>
  );
};

export default InitialInfo;
