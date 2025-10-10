import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type LanguageChangerProps = {
  className?: string
}

const LanguageChanger = ({className}: LanguageChangerProps) => {

  return (
    <Select defaultValue="en">
      <SelectTrigger variant="input" value="en" className={cn("w-[150px] h-10", className)}>
        <SelectValue placeholder="English" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="cz">Czech</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default LanguageChanger
