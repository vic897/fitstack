"use client";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

type PageToken = number | "ellipsis-left" | "ellipsis-right";

function buildPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PageToken[] = [1];

  if (currentPage > 3) {
    tokens.push("ellipsis-left");
  }

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);
  for (let p = windowStart; p <= windowEnd; p++) {
    tokens.push(p);
  }

  if (currentPage < totalPages - 2) {
    tokens.push("ellipsis-right");
  }

  tokens.push(totalPages);
  return tokens;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
}: PaginationBarProps) {
  const tokens = buildPageTokens(currentPage, totalPages);

  return (
    <div
      id="exercise-pagination"
      className="flex flex-col items-center justify-between gap-space-md rounded-xl border border-outline-variant/25 bg-surface-container-low/85 p-space-md sm:flex-row"
    >
      <span className="font-label-md text-label-md text-on-surface-variant">
        Showing{" "}
        <strong className="font-semibold text-on-surface">
          {startItem}–{endItem}
        </strong>{" "}
        of{" "}
        <strong className="font-semibold text-on-surface">{totalItems}</strong>{" "}
        {totalItems === 1 ? "exercise" : "exercises"}
      </span>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          aria-label="First page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">
            first_page
          </span>
        </button>

        {tokens.map((token) =>
          typeof token === "number" ? (
            <button
              key={token}
              type="button"
              aria-current={token === currentPage ? "page" : undefined}
              onClick={() => onPageChange(token)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-label-md text-label-md transition-colors ${
                token === currentPage
                  ? "bg-primary-container font-bold text-on-primary-container shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              {token}
            </button>
          ) : (
            <span
              key={token}
              className="select-none px-1 text-on-surface-variant/60"
            >
              ...
            </span>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
