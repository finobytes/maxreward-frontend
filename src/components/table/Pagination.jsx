import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Production-grade Pagination Component
 * Handles large page numbers with ellipsis/sliding window logic.
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onPageChange - Callback when page changes (pageNumber)
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Ensure props are numbers to avoid logic errors
  const current = Number(currentPage);
  const total = Number(totalPages);

  const paginationRange = useMemo(() => {
    // If total pages is 7 or less, show all numbers
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Determine the range of pages to show around the current page
    const siblingCount = 1;
    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, total);

    // We modify when to show dots based on how close we are to the ends
    // We expect to show at least 3 items on the ends if we are close enough
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < total - 1;

    // Case 1: Show right dots only (we are near the start)
    // [1] [2] [3] [4] [5] ... [100]
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", total];
    }

    // Case 2: Show left dots only (we are near the end)
    // [1] ... [96] [97] [98] [99] [100]
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => total - rightItemCount + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    // Case 3: Show both dots (we are in the middle)
    // [1] ... [49] [50] [51] ... [100]
    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, "...", ...middleRange, "...", total];
    }

    return [];
  }, [current, total]);

  if (total <= 1) return null;

  return (
    <nav
      className="flex flex-col md:flex-row items-center justify-between pt-4 gap-4"
      aria-label="Table navigation"
    >
      {/* Mobile/Compact View: Text Summary */}
      <span className="text-sm font-normal text-gray-500">
        Page <span className="font-semibold text-gray-900">{current}</span> of{" "}
        <span className="font-semibold text-gray-900">{total}</span>
      </span>

      {/* Pagination Controls */}
      <ul className="inline-flex items-center -space-x-px text-sm h-8 shadow-sm">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(current - 1, 1))}
            disabled={current === 1}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </li>

        {/* Page Numbers */}
        {paginationRange.map((pageNumber, idx) => {
          // If it's an ellipsis
          if (pageNumber === "...") {
            return (
              <li key={`dots-${idx}`}>
                <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              </li>
            );
          }

          // If it's a number
          return (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === current ? "page" : undefined}
                className={`flex items-center justify-center px-3 h-8 border border-gray-300 transition-colors ${
                  pageNumber === current
                    ? "z-10 text-white bg-brand-600 border-brand-600 hover:bg-brand-700 hover:text-white"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(current + 1, total))}
            disabled={current === total}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
