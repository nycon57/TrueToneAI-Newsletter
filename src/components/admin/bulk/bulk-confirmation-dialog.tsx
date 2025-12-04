"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BulkConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject";
  articleIds: string[];
  onComplete: () => void;
}

type ProcessingState = "idle" | "processing" | "complete" | "error";

interface ProcessingResult {
  success: boolean;
  processed: number;
  failed: string[];
  errors?: Record<string, string>;
}

export function BulkConfirmationDialog({
  open,
  onOpenChange,
  action,
  articleIds,
  onComplete,
}: BulkConfirmationDialogProps) {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const isApprove = action === "approve";
  const count = articleIds.length;

  const handleConfirm = async () => {
    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setProcessingState("processing");
    setProgress(10);

    try {
      // Simulate progress while waiting for API
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 85));
      }, 200);

      const response = await fetch("/api/admin/articles/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          articleIds,
          reviewNotes: notes.trim() || undefined,
          rejectionReason: rejectionReason.trim() || undefined,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to process bulk action");
      }

      const data: ProcessingResult = await response.json();
      setProgress(100);
      setResult(data);

      if (data.success && data.failed.length === 0) {
        setProcessingState("complete");
        toast.success(
          `Successfully ${isApprove ? "approved" : "rejected"} ${data.processed} article${data.processed !== 1 ? "s" : ""}`
        );
      } else if (data.failed.length > 0) {
        setProcessingState("error");
        toast.warning(
          `${data.processed} succeeded, ${data.failed.length} failed`
        );
      }
    } catch (error) {
      setProcessingState("error");
      setResult({
        success: false,
        processed: 0,
        failed: articleIds,
      });
      toast.error("Failed to process bulk action");
    }
  };

  const handleClose = () => {
    if (processingState === "processing") return; // Prevent closing while processing

    // Reset state
    setNotes("");
    setRejectionReason("");
    setProcessingState("idle");
    setProgress(0);
    setResult(null);

    if (processingState === "complete" || processingState === "error") {
      onComplete();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            {isApprove ? "Approve" : "Reject"} {count} Article{count !== 1 ? "s" : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {processingState === "idle" && (
              <>
                Are you sure you want to {isApprove ? "approve" : "reject"} {count} selected
                article{count !== 1 ? "s" : ""}?
                {isApprove
                  ? " They will be published immediately."
                  : " The creators will be notified with your reason."}
              </>
            )}
            {processingState === "processing" && (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing articles...
              </span>
            )}
            {processingState === "complete" && (
              <span className="text-green-600">
                Successfully {isApprove ? "approved" : "rejected"} all articles!
              </span>
            )}
            {processingState === "error" && result && (
              <span className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {result.processed} succeeded, {result.failed.length} failed
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {processingState === "idle" && (
          <div className="space-y-4 py-4">
            {!isApprove && (
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">
                  Rejection Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explain why these articles are being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="review-notes">Review Notes (Optional)</Label>
              <Textarea
                id="review-notes"
                placeholder="Add any additional notes for this batch..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        {(processingState === "processing" || processingState === "complete") && (
          <div className="py-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {progress < 100
                ? `Processing ${count} articles...`
                : `${result?.processed || count} articles processed`}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          {processingState === "idle" && (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleConfirm();
                }}
                className={
                  isApprove
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-destructive hover:bg-destructive/90"
                }
              >
                {isApprove ? "Approve All" : "Reject All"}
              </AlertDialogAction>
            </>
          )}

          {(processingState === "complete" || processingState === "error") && (
            <AlertDialogAction onClick={handleClose}>Done</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
