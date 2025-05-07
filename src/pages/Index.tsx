
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-10 animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src="/lovable-uploads/0619453a-5eda-4804-88ed-4f919b07fb5c.png" 
            alt="Brasão da Polícia Civil" 
            className="w-16 h-16 object-contain" 
          />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-police-blue mb-4">
        Relatório de Plantão
      </h1>
      <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-6">
        Delegacia Especializada em Investigações de Crimes de Trânsito
      </h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p className="text-gray-700 mb-6 leading-relaxed">
          Este sistema foi desenvolvido para padronizar os relatórios de plantão da DICT, 
          permitindo o registro detalhado de ocorrências, imagens e observações para 
          documentação oficial.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-police-blue mb-2">Dados do Plantão</h3>
            <p className="text-gray-600 text-sm">
              Registre informações sobre equipe, período e responsáveis pelo plantão.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-police-blue mb-2">Ocorrências</h3>
            <p className="text-gray-600 text-sm">
              Documente as ocorrências atendidas durante o período de plantão.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-police-blue mb-2">Imagens e Observações</h3>
            <p className="text-gray-600 text-sm">
              Adicione imagens relevantes e observações importantes sobre o plantão.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-police-blue mb-2">Relatório Final</h3>
            <p className="text-gray-600 text-sm">
              Visualize e exporte o relatório completo em PDF ou DOCX.
            </p>
          </div>
        </div>
      </div>
      
      <Link to="/initial-info">
        <Button className="bg-police-blue hover:bg-police-lightblue gap-2 text-lg px-6 py-6 h-auto">
          Iniciar Novo Relatório
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default Index;
