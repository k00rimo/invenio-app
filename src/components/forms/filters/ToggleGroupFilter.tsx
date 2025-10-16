import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import AccordionFilterWrapper from "./AccordionFilterWrapper"

export type RadioOption = {
  label: string
  count: number
}

type ToggleGroupFilterProps = {
  options: RadioOption[]
  className?: string
}

const ToggleGroupFilter = ({
  options,
  className
}: ToggleGroupFilterProps) => {
  if (options.length === 0) {
    return null
  }

  return (
    <AccordionFilterWrapper title="Language">
      <ToggleGroup 
        type="multiple" 
        className={cn("w-full flex flex-col items-start gap-2.5", className)}
      >
        {options.map((item, index) => (
          <div key={index} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ToggleGroupItem 
                variant="outline" 
                size="sm" 
                value={item.label} 
                id={item.label}
                className="w-6 h-6 p-0 data-[state=on]:bg-primary text-transparent data-[state=on]:text-background"
              >
                <CheckIcon className="h-4 w-4 z-50" />
              </ToggleGroupItem>
              <Label htmlFor={item.label} className="cursor-pointer">
                {item.label}
              </Label>
            </div>
            <span className="text-gray-dark">({item.count})</span>
          </div>
        ))}
      </ToggleGroup>
    </AccordionFilterWrapper>
  )
}

export default ToggleGroupFilter
