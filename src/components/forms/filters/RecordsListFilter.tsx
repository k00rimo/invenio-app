import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import ToggleGroupFilter from "./ToggleGroupFilter"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"


type RecordsListFilterProps = {
  className?: string
}

const RecordsListFilter = ({className}: RecordsListFilterProps) => {

  const onClear = () => {
  }

  return (
    <div className={cn("space-y-5 p-5 bg-primary-light rounded-sm min-w-80", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading3">Filters</h3>
        <Button
          onClick={onClear}
          type="button"
          variant={"ghost"}
          size={"md"}
          aria-label="Clear all filters"
          className="hover:opacity-70 transition-opacity h-fit px-1 py-0.5 font-subheadline"
        >
          Clear
          <XIcon aria-hidden="true" className="size-6" />
        </Button>      
      </div>
      <Separator className="bg-foreground" />
      <div className="space-y-2.5">
        <div className="flex items-center justify-between font-input">
          <label>
            View all versions
          </label>
          <Switch />
        </div>

        <ToggleGroupFilter options={[{label: "English", count: 200}, {label: "Czech", count: 42}, {label: "Spanish", count: 11}]} />
        <ToggleGroupFilter options={[{label: "English", count: 200}, {label: "Czech", count: 42}, {label: "Spanish", count: 11}]} />

      </div>
      

    </div>
  )
}

export default RecordsListFilter
