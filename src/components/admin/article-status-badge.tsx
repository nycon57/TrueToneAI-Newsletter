import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Archive, HelpCircle } from "lucide-react";

interface ArticleStatusBadgeProps {
  status: string;
}

export function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
  const config = {
    draft: {
      label: "Pending Review",
      variant: "outline" as const,
      icon: Clock,
      className: "border-yellow-600 text-yellow-600",
    },
    published: {
      label: "Published",
      variant: "default" as const,
      icon: CheckCircle,
      className: "bg-green-600 hover:bg-green-700",
    },
    archived: {
      label: "Archived",
      variant: "secondary" as const,
      icon: Archive,
      className: "bg-gray-600 hover:bg-gray-700 text-white",
    },
  };

  // Normalize status to lowercase for lookup
  const normalizedStatus = status?.toLowerCase() as keyof typeof config;
  const statusConfig = config[normalizedStatus] || {
    label: status || "Unknown",
    variant: "outline" as const,
    icon: HelpCircle,
    className: "",
  };

  const { label, variant, icon: Icon, className } = statusConfig;

  return (
    <Badge variant={variant} className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}
