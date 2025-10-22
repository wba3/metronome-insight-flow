import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
  trendDirection?: "up" | "down";
  color?: string;
}

export const MetricCard = ({
  title,
  value,
  trend,
  icon,
  trendDirection = "up",
  color = "hsl(var(--primary))"
}: MetricCardProps) => {
  return (
    <Card className="premium-card group">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold mb-1 tracking-tight">{value}</div>
        <div className="flex items-center text-xs">
          {trendDirection === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-success mr-1" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive mr-1" />
          )}
          <span className={trendDirection === "up" ? "text-success" : "text-destructive"}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
