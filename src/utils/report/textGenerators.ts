
import { ReportData } from "../../types/report";
import { formatDateTime } from "./dateFormatters";

export function getIntroductoryText(reportData: ReportData): string {
  return `Trata-se do relatório de plantão de número ${reportData.reportNumber}, referente à jornada plantonista que se iniciou no dia ${formatDateTime(reportData.startDateTime)} e finalizou-se no dia ${formatDateTime(reportData.endDateTime)}.

O presente documento tem por finalidade registrar, de forma clara e sucinta, os principais atendimentos, ocorrências, procedimentos instaurados e providências adotadas durante o referido período de plantão na Delegacia Especializada em Investigações de Crimes de Trânsito - DICT.

Busca-se, com isso, sobrelevar as diligências preliminares realizadas em local de acidente de trânsito com vítima, assegurar a continuidade dos trabalhos investigativos, a rastreabilidade das ações empreendidas e a adequada comunicação entre as equipes que se sucedem, em conformidade com os princípios da legalidade, eficiência e transparência que regem a Administração Pública.`;
}

export function getObservationsText(observations: string): string {
  return observations.trim() || 
    "Não há informações dignas de nota decorrentes do Plantão ora documentado.";
}
