
import { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  children: ReactNode;
};

const PageContainer = ({ title, children }: PageContainerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-police-blue mb-6 pb-2 border-b border-gray-200">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default PageContainer;
