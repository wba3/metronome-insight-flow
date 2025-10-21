import { TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Monthly Recurring Revenue",
    value: "$284,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "Active Customers",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Avg. Usage per Customer",
    value: "89.4%",
    change: "+5.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-accent"
  },
  {
    title: "At-Risk Accounts",
    value: "23",
    change: "-15.3%",
    trend: "down",
    icon: AlertCircle,
    color: "text-warning"
  }
];

export const MetricsCards = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Revenue Overview</h2>
        <p className="text-muted-foreground">Real-time metrics powered by Metronome's data pipeline</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          
          return (
            <Card key={metric.title} className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className={`flex items-center text-sm font-medium ${
                  isPositive ? "text-success" : "text-success"
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    !isPositive && "rotate-180"
                  }`} />
                  {metric.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
