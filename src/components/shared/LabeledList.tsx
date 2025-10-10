import { cn } from "@/lib/utils"
import { SlashIcon } from "lucide-react"

type LabeledListProps = {
  label: string
  list: string[]
  orientation: "horizontal" | "vertical"
  className?: string
}

const LabeledList = ({
  label,
  list,
  orientation = "horizontal",
  className
}: LabeledListProps) => {

  const isHorizontal = orientation === "horizontal"

  return (
    <div className={cn(
      "flex gap-2.5 items-center",
      !isHorizontal && "flex-col items-start gap-[5px]",
      className
      )}
    >
      <p className={cn(!isHorizontal && "font-subheadline")}>{label}{orientation === "horizontal" && ":"}</p>
      
      <div className="flex items-center gap-1">
        {list.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            <span className="font-body-small text-gray-dark">
              {item}
            </span>
            {index < list.length - 1 && <SlashIcon className="text-gray-dark"/>}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LabeledList
