import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type RadioOption = {
  label: string
  count: number
}

type ToggleGroupProps = {
  options: RadioOption[]
  className?: string
}

const ToggleGroupFilter = ({
  options,
  className
}: ToggleGroupProps) => {

  if (options.length == 0) {
    return "error"
  }

  return (
    <ToggleGroup type="multiple" defaultValue={options.length > 0 ? [options[0].label] : []} className={cn("w-full flex flex-col items-start rounded-none", className)}>
      {options.map((item, index) => (
        <div key={index} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ToggleGroupItem variant={"outline"} size={"sm"} value={item.label} id={item.label} />
            <Label htmlFor={item.label}>{item.label}</Label>
          </div>
          <span className="text-gray-dark">({item.count})</span>
        </div>
      ))}
    </ToggleGroup>
  )
}

export default ToggleGroupFilter
