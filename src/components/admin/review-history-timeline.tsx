import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, FileText, Edit } from "lucide-react";

interface Article {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  publishedAt: Date | null;
  rejectionReason: string | null;
  reviewNotes: string | null;
  createdBy: { name: string | null; email: string } | null;
  lastEditedBy: { name: string | null; email: string } | null;
}

interface ReviewHistoryTimelineProps {
  article: Article;
}

export function ReviewHistoryTimeline({ article }: ReviewHistoryTimelineProps) {
  const events = [];

  // Created event
  events.push({
    type: "created",
    icon: FileText,
    title: "Article Created",
    description: `By ${article.createdBy?.name || article.createdBy?.email || "Unknown"}`,
    timestamp: article.createdAt,
    color: "text-blue-600",
  });

  // Submitted event
  if (article.submittedAt) {
    events.push({
      type: "submitted",
      icon: Clock,
      title: "Submitted for Review",
      description: "Article submitted to review queue",
      timestamp: article.submittedAt,
      color: "text-yellow-600",
    });
  }

  // Last edited event
  if (article.lastEditedBy && article.updatedAt.getTime() !== article.createdAt.getTime()) {
    events.push({
      type: "edited",
      icon: Edit,
      title: "Article Updated",
      description: `By ${article.lastEditedBy.name || article.lastEditedBy.email}`,
      timestamp: article.updatedAt,
      color: "text-gray-600",
    });
  }

  // Reviewed/Rejected event
  if (article.reviewedAt) {
    if (article.status === "PUBLISHED") {
      events.push({
        type: "approved",
        icon: CheckCircle,
        title: "Article Approved",
        description: article.reviewNotes || "Article has been approved and published",
        timestamp: article.reviewedAt,
        color: "text-green-600",
      });
    } else if (article.rejectionReason) {
      events.push({
        type: "rejected",
        icon: XCircle,
        title: "Article Rejected",
        description: article.rejectionReason,
        timestamp: article.reviewedAt,
        color: "text-red-600",
      });
    }
  }

  // Sort events by timestamp, most recent first
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review History</CardTitle>
        <CardDescription>Timeline of article events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history available</p>
          ) : (
            events.map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full border-2 border-background p-1.5 ${event.color}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      {event.type === "approved" && (
                        <Badge variant="default" className="bg-green-600">
                          Approved
                        </Badge>
                      )}
                      {event.type === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Review Notes Section */}
        {article.reviewNotes && (
          <div className="mt-4 rounded-lg border bg-muted/50 p-3">
            <h4 className="text-xs font-medium mb-1">Review Notes</h4>
            <p className="text-sm text-muted-foreground">{article.reviewNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
