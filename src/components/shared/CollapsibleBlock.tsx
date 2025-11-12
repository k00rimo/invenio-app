import { useState, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";


type CollapsibleBlockProps = {
  label: string
  text: string
  className?: string
}

const CollapsibleBlock = ({ label, text, className }: CollapsibleBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const contentId = useId();

  const toggleIsExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <p>{label}</p>
      <div className="flex gap-2.5">
        <p
          ref={textRef}
          id={contentId}
          className={cn(
            "font-narrow-text text-gray-dark transition-all",
            !isExpanded && "line-clamp-3"
          )}
        >
          {text}
        </p>
        
        <Button
          onClick={toggleIsExpanded}
          variant="ghost"
          size="icon"
          className="self-end shrink-0 p-0 size-6"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
        >
          {isExpanded ? 
            <ChevronUp className="shrink-0 text-gray-dark w-6 h-6" />
            : <ChevronDown className="shrink-0 text-gray-dark w-6 h-6" />
          }
        </Button>
      </div>
    </div>
  );
}

export default CollapsibleBlock
