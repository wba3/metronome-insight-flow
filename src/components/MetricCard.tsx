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
    <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center text-sm">
          {trendDirection === "up" ? (
            <TrendingUp className="h-4 w-4 text-success mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive mr-1" />
          )}
          <span className={trendDirection === "up" ? "text-success" : "text-destructive"}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
