import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type DataLoaderProps = {
  className?: string
}

const DataLoader = ({ className }: DataLoaderProps) => {
  
  return (
    <div className={cn("self-center flex w-full max-w-3xl justify-center py-16", className)}>
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

export default DataLoader
