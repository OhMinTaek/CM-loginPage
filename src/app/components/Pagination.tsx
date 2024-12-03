'use client';

import { useRouter } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();

  const goToPreviousPage = () => {
    router.push(`/?page=${currentPage - 1}`);
  };

  const goToNextPage = () => {
    router.push(`/?page=${currentPage + 1}`);
  };

  return (
    <div className="flex justify-center gap-4 mt-4">
      {currentPage > 1 && (
        <button onClick={goToPreviousPage} className="px-4 py-2 border rounded">
          Previous
        </button>
      )}
      {currentPage < totalPages && (
        <button onClick={goToNextPage} className="px-4 py-2 border rounded">
          Next
        </button>
      )}
    </div>
  );
}