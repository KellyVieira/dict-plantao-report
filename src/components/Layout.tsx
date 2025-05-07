
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ReportProvider } from "../contexts/ReportContext";

const Layout = () => {
  try {
    return (
      <ReportProvider>
        <div className="min-h-screen bg-police-gray flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto p-4 md:p-6">
            <Outlet />
          </main>
          <footer className="bg-police-blue text-white py-4 text-center text-sm">
            <div className="container mx-auto">
              <p>Delegacia Especializada em Investigações de Crimes de Trânsito (DICT) - Polícia Civil do Estado de Goiás</p>
            </div>
          </footer>
        </div>
      </ReportProvider>
    );
  } catch (error) {
    console.error("Erro ao renderizar Layout:", error);
    return <div className="p-4">Erro ao carregar o layout do aplicativo. Por favor, verifique o console para mais detalhes.</div>;
  }
};

export default Layout;
