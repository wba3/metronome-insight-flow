import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

const commitAccounts = [
  {
    name: "Enterprise Corp",
    commit: 500000,
    used: 423000,
    remaining: 77000,
    percentUsed: 84.6,
    daysRemaining: 42,
    status: "on-track"
  },
  {
    name: "TechStart Inc",
    commit: 250000,
    used: 238000,
    remaining: 12000,
    percentUsed: 95.2,
    daysRemaining: 38,
    status: "at-risk"
  },
  {
    name: "Global Solutions",
    commit: 750000,
    used: 425000,
    remaining: 325000,
    percentUsed: 56.7,
    daysRemaining: 67,
    status: "healthy"
  },
  {
    name: "Innovation Labs",
    commit: 150000,
    used: 98000,
    remaining: 52000,
    percentUsed: 65.3,
    daysRemaining: 55,
    status: "healthy"
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "healthy": return "bg-success/10 text-success border-success/20";
    case "on-track": return "bg-primary/10 text-primary border-primary/20";
    case "at-risk": return "bg-warning/10 text-warning border-warning/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getProgressColor = (percent: number) => {
  if (percent >= 90) return "bg-warning";
  if (percent >= 70) return "bg-primary";
  return "bg-success";
};

export const CommitDrawdown = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-subtle">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Commit Drawdown Tracking</h2>
        <p className="text-muted-foreground">Monitor customer commitment usage in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {commitAccounts.map((account) => (
          <Card key={account.name} className="glass-card hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{account.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    ${account.commit.toLocaleString()} annual commit
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Usage Progress</span>
                  <span className="font-semibold">{account.percentUsed}%</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={account.percentUsed} 
                    className="h-3"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(account.percentUsed)}`}
                    style={{ width: `${account.percentUsed}%` }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Used to Date
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${account.used.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Remaining
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${account.remaining.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Days remaining */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {account.daysRemaining} days remaining in contract period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
