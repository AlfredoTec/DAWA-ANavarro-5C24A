"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function PageJumper({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(String(currentPage));

  function navigate(page: number) {
    const clampedPage = Math.max(1, Math.min(totalPages, page));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(clampedPage));
    router.push(`?${params.toString()}`);
  }

  function handleInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) navigate(parsed);
  }

  // Build visible page range (±2 around current)
  const pages: (number | "...")[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  if (start > 1) { pages.push(1); if (start > 2) pages.push("..."); }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Page buttons */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => navigate(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Primera página"
        >
          <FiChevronsLeft />
        </button>
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Página anterior"
        >
          <FiChevronLeft />
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-[#8896b0] select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`min-w-[36px] h-9 px-2 rounded-lg border text-sm font-semibold transition-all ${
                page === currentPage
                  ? "border-[#39ff14] bg-[#39ff14]/10 text-[#39ff14]"
                  : "border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/50"
              }`}
              style={{ fontFamily: page === currentPage ? "var(--font-orbitron)" : undefined }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Página siguiente"
        >
          <FiChevronRight />
        </button>
        <button
          onClick={() => navigate(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[#1e3a5f] text-[#8896b0] hover:text-[#39ff14] hover:border-[#39ff14]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Última página"
        >
          <FiChevronsRight />
        </button>
      </div>

      {/* Jump to page */}
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
        <label className="text-[#8896b0] text-sm">Ir a página</label>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-16 px-2 py-1 rounded-lg border border-[#1e3a5f] bg-[#0a1020] text-white text-sm text-center focus:border-[#39ff14] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg border border-[#39ff14]/40 text-[#39ff14] text-sm hover:bg-[#39ff14]/10 transition-all"
        >
          Ir
        </button>
        <span className="text-[#8896b0] text-sm">de {totalPages}</span>
      </form>
    </div>
  );
}
