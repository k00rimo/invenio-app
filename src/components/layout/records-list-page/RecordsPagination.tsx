import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type RecordsPaginationProps = {
  page: number // (1 = first page)
  recordsCount: number
  recordsPerPage: number
  onPageChange?: (page: number) => void
  className?: string
}

const RecordsPagination = ({
  page,
  recordsCount,
  recordsPerPage,
  onPageChange,
  className,
}: RecordsPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(recordsCount / recordsPerPage))

  const handlePageChange = (currPage: number) => {
    if (currPage >= 1 && currPage <= totalPages && currPage !== page) {
      onPageChange?.(currPage)
    }
  }

  const renderPageLink = (pageIndex: number) => (
    <PaginationItem key={pageIndex}>
      <PaginationLink
        href="#"
        isActive={pageIndex === page}
        className={cn(pageIndex === page && "bg-primary-dark font-input p-1 rounded-md")}
        onClick={(e) => {
          e.preventDefault()
          handlePageChange(pageIndex)
        }}
      >
        {pageIndex}
      </PaginationLink>
    </PaginationItem>
  )

  const renderPages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => renderPageLink(i + 1))
    }

    const pages = [1, 2, 3]
    const shouldShowEllipsis = page > 3 || totalPages > 4

    return [
      ...pages.map(renderPageLink),
      shouldShowEllipsis && <PaginationEllipsis key="ellipsis" />,
      renderPageLink(totalPages),
    ].filter(Boolean)
  }

  return (
    <Pagination className={cn("", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={page === 1}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page - 1)
            }}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={page === totalPages}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default RecordsPagination
