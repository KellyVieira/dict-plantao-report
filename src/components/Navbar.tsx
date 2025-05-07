
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-police-blue text-white shadow-md">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 overflow-hidden">
              <img 
                src="/lovable-uploads/0619453a-5eda-4804-88ed-4f919b07fb5c.png" 
                alt="Brasão da Polícia Civil" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">Relatório de Plantão - DICT</h1>
          </div>
          
          <nav className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <ul className="flex space-x-1 md:space-x-2">
              <NavItem to="/" active={isActive("/")}>
                Início
              </NavItem>
              <NavItem to="/initial-info" active={isActive("/initial-info")}>
                Dados Iniciais
              </NavItem>
              <NavItem to="/occurrences" active={isActive("/occurrences")}>
                Ocorrências
              </NavItem>
              <NavItem to="/images-notes" active={isActive("/images-notes")}>
                Imagens/Observações
              </NavItem>
              <NavItem to="/report-export" active={isActive("/report-export")}>
                Relatório
              </NavItem>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

type NavItemProps = {
  to: string;
  active: boolean;
  children: React.ReactNode;
};

const NavItem = ({ to, active, children }: NavItemProps) => (
  <li>
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm md:text-base whitespace-nowrap block",
        active
          ? "bg-police-lightblue text-white"
          : "text-white/80 hover:bg-police-lightblue/50 transition-colors"
      )}
    >
      {children}
    </Link>
  </li>
);

export default Navbar;
