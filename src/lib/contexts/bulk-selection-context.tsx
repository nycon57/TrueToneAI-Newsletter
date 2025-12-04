"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BulkSelectionContextType {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  selectedCount: number;
}

const BulkSelectionContext = createContext<BulkSelectionContextType | null>(null);

interface BulkSelectionProviderProps {
  children: ReactNode;
}

export function BulkSelectionProvider({ children }: BulkSelectionProviderProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      // If all provided ids are already selected, deselect all
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) {
        return new Set();
      }
      // Otherwise, select all
      return new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <BulkSelectionContext.Provider
      value={{
        selectedIds,
        isSelected,
        toggleSelection,
        selectAll,
        clearSelection,
        selectedCount: selectedIds.size,
      }}
    >
      {children}
    </BulkSelectionContext.Provider>
  );
}

export function useBulkSelection() {
  const context = useContext(BulkSelectionContext);
  if (!context) {
    throw new Error("useBulkSelection must be used within a BulkSelectionProvider");
  }
  return context;
}
