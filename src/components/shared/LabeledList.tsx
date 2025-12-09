import { useState, useId } from "react"
import { cn } from "@/lib/utils"
import { SlashIcon, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "../ui/button"

type LabeledListProps = {
  label: string
  list: string[]
  orientation?: "horizontal" | "vertical"
  className?: string
  maxVisibleItems?: number
}

const LabeledList = ({
  label,
  list,
  orientation = "horizontal",
  className,
  maxVisibleItems = 5
}: LabeledListProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentId = useId()
  
  const isHorizontal = orientation === "horizontal"
  const shouldCollapse = list.length > maxVisibleItems

  // Determine which items to render based on state
  const visibleItems = shouldCollapse && !isExpanded 
    ? list.slice(0, maxVisibleItems) 
    : list

  const toggleIsExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isHorizontal ? "items-center" : "flex-col items-start gap-[5px]",
        isExpanded && "items-start",
        className
      )}
    >
      <p className={cn("shrink-0", !isHorizontal && "font-subheadline")}>
        {label}{isHorizontal && ":"}
      </p>

      <div className="flex gap-2.5 items-center">
        <div 
          id={contentId}
          className="flex flex-wrap items-center gap-1"
        >
          {visibleItems.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              <span className="font-body-small text-gray-dark break-all">
                {item}
              </span>
              
              {(index < list.length - 1) && (
                 (isExpanded || index < visibleItems.length - 1) ? (
                   <SlashIcon className="text-gray-dark w-3 h-3" />
                 ) : null
              )}
            </span>
          ))}
          
          {shouldCollapse && !isExpanded && (
            <span className="text-gray-dark font-body-small">...</span>
          )}
        </div>

        {shouldCollapse && (
          <Button
            onClick={toggleIsExpanded}
            variant="ghost"
            size="icon"
            className="self-start shrink-0 p-0 size-6"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            aria-label={isExpanded ? `Collapse ${label} list` : `Show all ${label}`}
          >
            {isExpanded ? (
              <ChevronUp className="shrink-0 text-gray-dark w-5 h-5" />
            ) : (
              <ChevronDown className="shrink-0 text-gray-dark w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default LabeledList
