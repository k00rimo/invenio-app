import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { useSearchParams } from "react-router"
import AccordionFilterWrapper from "./AccordionFilterWrapper"

export type FilterOption = {
  label: string
  value: string
  count?: number // Optional now, as API might not give it to us
}

type ToggleGroupFilterProps = {
  title: string
  paramKey: string
  options: FilterOption[]
  className?: string
  defaultOpen?: boolean
}

const ToggleGroupFilter = ({
  title,
  paramKey,
  options,
  className,
  defaultOpen = false
}: ToggleGroupFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const selectedValues = searchParams.getAll(paramKey)

  if (options.length === 0) {
    return null
  }

  const handleValueChange = (newValues: string[]) => {
    const newParams = new URLSearchParams(searchParams)

    newParams.delete(paramKey)
    newValues.forEach(value => newParams.append(paramKey, value))
    newParams.set("page", "1")
    
    setSearchParams(newParams, { replace: true })
  }

  return (
    <AccordionFilterWrapper title={title} defaultOpen={defaultOpen}>
      <ToggleGroup 
        type="multiple" 
        className={cn("w-full flex flex-col items-start gap-2", className)}
        value={selectedValues}
        onValueChange={handleValueChange}
      >
        {options.map((item) => (
          <div key={item.value} className="w-full flex items-center justify-between group">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <ToggleGroupItem 
                variant="outline" 
                size="sm" 
                value={item.value} 
                id={`${paramKey}-${item.value}`}
                className="w-5 h-5 shrink-0 min-w-5 max-w-5 p-0 data-[state=on]:bg-primary text-transparent data-[state=on]:text-background"
                aria-label={`Filter by ${item.label}`}
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <Label 
                htmlFor={`${paramKey}-${item.value}`} 
                className="cursor-pointer font-body-small text-gray-dark truncate max-w-48"
                title={item.label}
              >
                {item.label}
              </Label>
            </div>
            {item.count !== undefined && (
              <span className="text-gray-dark font-body-small shrink-0">
                {"("}{item.count}{")"}
              </span>
            )}
          </div>
        ))}
      </ToggleGroup>
    </AccordionFilterWrapper>
  )
}

export default ToggleGroupFilter
