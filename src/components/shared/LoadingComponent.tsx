import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type LoadingComponentProps = {
  className?: string;
  label?: string; // accessible label under spinner; set null to hide
  spinnerClassName?: string; // customize spinner size/color
};

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  className,
  label = "Loading...",
  spinnerClassName,
}) => {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Spinner className={cn("size-8", spinnerClassName)} />
        {label && <span className="text-sm">{label}</span>}
      </div>
    </div>
  );
};

export default LoadingComponent;
