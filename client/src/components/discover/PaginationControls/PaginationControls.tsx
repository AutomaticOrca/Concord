import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Pagination as PaginationType } from "@/types/user";
import { cn } from "@/lib/utils";

interface Props {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ pagination, onPageChange }: Props) => {
  const { currentPage, totalPages } = pagination;

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageLinks = () => {
    const pages: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      }
    }

    const result: React.ReactNode[] = [];
    let lastPage = 0;

    pages.forEach((page) => {
      if (lastPage && page - lastPage > 1) {
        result.push(
          <PaginationItem key={`ellipsis-${page}`}>
            <PaginationEllipsis className="text-emerald-400 opacity-60 px-2" />
          </PaginationItem>
        );
      }

      result.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all shadow-sm",
              page === currentPage
                ? "bg-gradient-to-tr from-green-200 to-yellow-100 text-emerald-900 font-semibold shadow-md"
                : "bg-white/10 text-emerald-800 hover:bg-white/20 hover:scale-105"
            )}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );

      lastPage = page;
    });

    return result;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(currentPage - 1);
            }}
            className="rounded-full px-4 py-2 text-sm text-emerald-800 bg-white/10 hover:bg-white/20 transition"
          />
        </PaginationItem>

        {renderPageLinks()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(currentPage + 1);
            }}
            className="rounded-full px-4 py-2 text-sm text-emerald-800 bg-white/10 hover:bg-white/20 transition"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
