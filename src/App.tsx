
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import InitialInfo from "./pages/InitialInfo";
import Occurrences from "./pages/Occurrences";
import ImagesNotes from "./pages/ImagesNotes";
import ReportExport from "./pages/ReportExport";
import NotFound from "./pages/NotFound";

// Criando o query client fora do componente para evitar recriação
const queryClient = new QueryClient();

const App = () => {
  // Envolvendo em um try-catch para capturar erros de renderização
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="initial-info" element={<InitialInfo />} />
                <Route path="occurrences" element={<Occurrences />} />
                <Route path="images-notes" element={<ImagesNotes />} />
                <Route path="report-export" element={<ReportExport />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Erro ao renderizar App:", error);
    return <div>Erro ao carregar o aplicativo. Por favor, verifique o console para mais detalhes.</div>;
  }
};

export default App;
