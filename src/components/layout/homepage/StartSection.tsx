import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"

type StartSectionProps = {
  className?: string
}

const StartSection = ({className}: StartSectionProps) => {

  return (
    <div className={cn("w-full bg-secondary-light flex items-center justify-center gap-24 py-24 px-2.5", className)}>
      <h3 className="font-heading3">Ready to start?</h3>
      <Link to={"/experiments"}>
        <Button>Explore experiments</Button>
      </Link>
    </div>
  )
}

export default StartSection
