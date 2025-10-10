import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import ToggleGroupFilter from "./ToggleGroup"


type RecordsListFilterProps = {
  className?: string
}

const RecordsListFilter = ({className}: RecordsListFilterProps) => {

  return (
    <div className={cn("space-y-5 p-5 bg-primary-light rounded-xl min-w-80", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading3">Filters</h3>
        {/* clear button */}
      </div>
      <Separator className="text-foreground" />
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label>
            View all versions
          </label>
          <Switch />
        </div>

        <ToggleGroupFilter options={[{label: "English", count: 200}, {label: "Czech", count: 42}, {label: "Spanish", count: 11}]} />

      </div>
      

    </div>
  )
}

export default RecordsListFilter
