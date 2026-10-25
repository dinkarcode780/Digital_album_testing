import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-40"
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 border rounded-lg"
          >
            1
          </button>

          {start > 2 && <span>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg ${
            page === currentPage ? "bg-purple-600 text-white" : "border"
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>...</span>}

          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 border rounded-lg"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
