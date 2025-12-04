"use client";

import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBulkSelection } from "@/lib/contexts/bulk-selection-context";
import { BulkConfirmationDialog } from "./bulk-confirmation-dialog";

interface BulkActionsBarProps {
  onComplete?: () => void;
}

export function BulkActionsBar({ onComplete }: BulkActionsBarProps) {
  const { selectedCount, clearSelection, selectedIds } = useBulkSelection();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">("approve");

  if (selectedCount === 0) return null;

  const handleOpenDialog = (action: "approve" | "reject") => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleComplete = () => {
    setDialogOpen(false);
    clearSelection();
    onComplete?.();
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex items-center gap-4 bg-background border rounded-full shadow-lg px-6 py-3">
          <span className="text-sm font-medium">
            {selectedCount} article{selectedCount !== 1 ? "s" : ""} selected
          </span>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => handleOpenDialog("approve")}
            >
              <CheckCircle className="h-4 w-4" />
              Approve All
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => handleOpenDialog("reject")}
            >
              <XCircle className="h-4 w-4" />
              Reject All
            </Button>
          </div>

          <div className="h-4 w-px bg-border" />

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <BulkConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={dialogAction}
        articleIds={Array.from(selectedIds)}
        onComplete={handleComplete}
      />
    </>
  );
}
