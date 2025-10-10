import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SearchIcon, UploadCloudIcon } from "lucide-react"
import { Link } from "react-router"

type SearchInputDepositionProps = {
  className?: string
}

const SearchInputDeposition = ({className}: SearchInputDepositionProps) => {

  return (
    <div className={cn("flex gap-5 items-center", className)}>
      <div className="flex w-full">
        <Input className="rounded-r-none" />
        <Button className="rounded-l-none h-14" leftIcon={<SearchIcon className="h-6 w-6" />}>
          Search
        </Button>
      </div>
      <Link to={"/deposition"}>
        <Button variant={"secondary"} leftIcon={<UploadCloudIcon />} className="h-14">
          Deposition
        </Button>
      </Link>
    </div>
  )
}

export default SearchInputDeposition
