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
  activeIndex: number // (1 = first page)
  recordsCount: number
  recrodsPerPage: number
  onPageChange?: (page: number) => void
  className?: string
}

const RecordsPagination = ({
  activeIndex,
  recordsCount,
  recrodsPerPage,
  onPageChange,
  className,
}: RecordsPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(recordsCount / recrodsPerPage))

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== activeIndex) {
      onPageChange?.(page)
    }
  }

  const renderPageLink = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        href="#"
        isActive={page === activeIndex}
        className={cn(page === activeIndex && "bg-primary-dark font-input p-1 rounded-md")}
        onClick={(e) => {
          e.preventDefault()
          handlePageChange(page)
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  )

  const renderPages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => renderPageLink(i + 1))
    }

    const pages = [1, 2, 3]
    const shouldShowEllipsis = activeIndex > 3 || totalPages > 4

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
            disabled={activeIndex === 1}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(activeIndex - 1)
            }}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={activeIndex === totalPages}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(activeIndex + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default RecordsPagination
