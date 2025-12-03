import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SearchIcon, UploadCloudIcon } from "lucide-react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router"
import { useEffect, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const searchSchema = z.object({
  query: z.string().trim().max(200, "Search query is too long")
})

type SearchFormData = z.infer<typeof searchSchema>

type SearchInputDepositionProps = {
  query?: string
  secondaryBtnLink?: string
  secondaryBtnText?: string
  secondaryBtnIcon?: ReactNode
  searchUrl?: string
  className?: string
}

const SearchInputDeposition = ({
  className,
  query,
  secondaryBtnLink = "/deposition",
  secondaryBtnText = "Deposition",
  secondaryBtnIcon = <UploadCloudIcon />,
  searchUrl = "/records-list",
}: SearchInputDepositionProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  
  const urlQuery = searchParams.get('q') || query || ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: urlQuery
    }
  })

  useEffect(() => {
    reset({ query: urlQuery })
  }, [urlQuery, reset])

const onSubmit = (data: SearchFormData) => {
    let params: URLSearchParams;

    if (location.pathname === searchUrl) {
      params = new URLSearchParams(searchParams);
    } else {
      params = new URLSearchParams();
    }

    if (data.query) {
      params.set("q", data.query);
    } else {
      params.delete("q");
    }

    // 5. UX: Always reset pagination on a new text search
    // (Adjust 'page' to whatever key you use for pagination)
    params.delete("page");
    navigate(`${searchUrl}?${params.toString()}`);
  }

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-1">
        <div className="flex w-full">
          <Input 
            size={"lg"}
            className="rounded-r-none" 
            {...register("query")}
            placeholder="Search records... (e.g., Molecular data)" 
          />
          <Button 
            type="submit"
            className="rounded-l-none h-14" 
            leftIcon={<SearchIcon className="h-6 w-6" />}
          >
            Search
          </Button>
        </div>
        {errors.query && (
          <p className="text-sm text-red-500">{errors.query.message}</p>
        )}
      </form>
      {secondaryBtnLink && secondaryBtnText && (
        <Link to={secondaryBtnLink}>
          <Button
            variant={"secondary"}
            className="h-14"
            leftIcon={secondaryBtnIcon}
          >
            {secondaryBtnText}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default SearchInputDeposition
