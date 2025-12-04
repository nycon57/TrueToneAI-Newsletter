"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Loader2, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface ApprovalActionsProps {
  articleId: string;
  currentStatus: string;
}

export function ApprovalActions({ articleId, currentStatus }: ApprovalActionsProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          reviewNotes: reviewNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve article");
      }

      toast.success("Article approved successfully");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error("Error approving article:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve article");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          rejectionReason,
          reviewNotes: reviewNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject article");
      }

      toast.success("Article rejected");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting article:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject article");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unpublish",
          reviewNotes: reviewNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unpublish article");
      }

      toast.success("Article unpublished successfully");
      router.refresh();
    } catch (error) {
      console.error("Error unpublishing article:", error);
      toast.error(error instanceof Error ? error.message : "Failed to unpublish article");
    } finally {
      setIsUnpublishing(false);
    }
  };

  // Normalize status to lowercase for comparison
  const status = currentStatus?.toLowerCase();

  if (status === "published") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publication Status</CardTitle>
          <CardDescription>This article is currently published</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Review Notes */}
          <div className="space-y-2">
            <Label htmlFor="unpublishNotes">Notes (Optional)</Label>
            <Textarea
              id="unpublishNotes"
              placeholder="Add any notes about this change..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Unpublish Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full"
                variant="outline"
                disabled={isUnpublishing}
              >
                {isUnpublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unpublishing...
                  </>
                ) : (
                  <>
                    <Undo2 className="mr-2 h-4 w-4" />
                    Unpublish Article
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unpublish Article?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the article from public view and return it to draft status.
                  You can republish it later if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnpublish}>
                  Unpublish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  }

  if (status === "archived") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This article has been archived.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Actions</CardTitle>
        <CardDescription>Approve or reject this article</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Review Notes */}
        <div className="space-y-2">
          <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
          <Textarea
            id="reviewNotes"
            placeholder="Add any notes about this review..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Approve Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              variant="default"
              disabled={isApproving || isRejecting}
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Article
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Article?</AlertDialogTitle>
              <AlertDialogDescription>
                This will publish the article and make it visible to users. This action can be reversed later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove}>
                Approve & Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isApproving || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Article
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Article?</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this article. The creator will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this article is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reject Article
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
