import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";


type CollapsibleBlockProps = {
  label: string
  text: string
  className?: string
}

const CollapsibleBlock = ({ label, text, className }: CollapsibleBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const toggleIsExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <p>{label}</p>
      <div className="flex gap-2.5">
        <p
          ref={textRef}
          className={cn(
            "font-narrow-text text-gray-dark transition-all",
            !isExpanded && "line-clamp-3"
          )}
        >
          {text}
        </p>
        
        <Badge
          onClick={toggleIsExpanded}
          variant={"link"}
          className="self-end"
        >
          {isExpanded ? "Less text" : "More text"}
        </Badge>
      </div>
    </div>
  );
}

export default CollapsibleBlock
