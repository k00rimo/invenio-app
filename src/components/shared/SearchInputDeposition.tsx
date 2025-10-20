import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SearchIcon, UploadCloudIcon } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const searchSchema = z.object({
  query: z.string().trim().max(200, "Search query is too long")
})

type SearchFormData = z.infer<typeof searchSchema>

type SearchInputDepositionProps = {
  query?: string
  className?: string
}

const SearchInputDeposition = ({ className, query }: SearchInputDepositionProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
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
    if (data.query) {
      navigate(`/records-list?q=${encodeURIComponent(data.query)}`)
    } else {
      navigate('/records-list')
    }
  }

  return (
    <div className={cn("flex gap-5 items-center", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-1">
        <div className="flex w-full">
          <Input 
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
      <Link to={"/deposition"}>
        <Button variant={"secondary"} leftIcon={<UploadCloudIcon />} className="h-14">
          Deposition
        </Button>
      </Link>
    </div>
  )
}

export default SearchInputDeposition
