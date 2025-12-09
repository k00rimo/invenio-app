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
    // Case 1: If total pages are 7 or fewer, just show them all.
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(renderPageLink)
    }

    // Case 2: Near the start (e.g., Page 1, 2, 3, or 4)
    if (page <= 4) {
      return [
        ...[1, 2, 3, 4, 5].map(renderPageLink),
        <PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>,
        renderPageLink(totalPages),
      ]
    }

    // Case 3: Near the end (e.g., Page 97, 98, 99, 100)
    if (page >= totalPages - 3) {
      return [
        renderPageLink(1),
        <PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>,
        ...[totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages].map(renderPageLink),
      ]
    }

    // Case 4: Somewhere in the middle
    return [
      renderPageLink(1),
      <PaginationItem key="ellipsis-left"><PaginationEllipsis /></PaginationItem>,
      renderPageLink(page - 1),
      renderPageLink(page),
      renderPageLink(page + 1),
      <PaginationItem key="ellipsis-right"><PaginationEllipsis /></PaginationItem>,
      renderPageLink(totalPages),
    ]
  }

  if (totalPages <= 1) return null

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
