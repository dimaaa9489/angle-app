"use client";

import type { ReactNode } from "react";

import { SearchBar } from "@/components/SearchBar";

export type SearchPanelBarProps = {
  autoFocus?: boolean;
  activeFilterCount?: number;
  onFilterClick?: () => void;
  onSubmit?: () => void;
};

type SearchPanelProps = SearchPanelBarProps & {
  header?: ReactNode;
  footer?: ReactNode;
};

/** Shared search row — same width and layout on home and /search. */
export function SearchPanel({ header, footer, ...searchProps }: SearchPanelProps) {
  return (
    <div className="angle-search-panel w-full">
      {header ? <div className="angle-search-panel-head">{header}</div> : null}
      <SearchBar compact {...searchProps} />
      {footer}
    </div>
  );
}
