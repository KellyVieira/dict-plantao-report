
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PageNavigationProps = {
  prevPage?: string;
  nextPage?: string;
  onNext?: () => boolean | void;
};

const PageNavigation = ({ prevPage, nextPage, onNext }: PageNavigationProps) => {
  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNext) {
      const canProceed = onNext();
      if (!canProceed) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {prevPage ? (
        <Link to={prevPage}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
        </Link>
      ) : (
        <div></div>
      )}
      {nextPage && (
        <Link to={nextPage} onClick={handleNextClick}>
          <Button className="bg-police-blue hover:bg-police-lightblue gap-2">
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PageNavigation;
