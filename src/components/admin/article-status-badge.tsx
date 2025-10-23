import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Archive } from "lucide-react";

interface ArticleStatusBadgeProps {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
  const config = {
    DRAFT: {
      label: "Pending Review",
      variant: "outline" as const,
      icon: Clock,
      className: "border-yellow-600 text-yellow-600",
    },
    PUBLISHED: {
      label: "Published",
      variant: "default" as const,
      icon: CheckCircle,
      className: "bg-green-600 hover:bg-green-700",
    },
    ARCHIVED: {
      label: "Archived",
      variant: "secondary" as const,
      icon: Archive,
      className: "bg-gray-600 hover:bg-gray-700 text-white",
    },
  };

  const { label, variant, icon: Icon, className } = config[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
