import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, Bell, Database, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Dashboards",
    description: "Live usage metrics updated instantly via Metronome's data pipeline"
  },
  {
    icon: BarChart3,
    title: "GTM Reporting",
    description: "Empower sales and CS teams with customer health and revenue insights"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Proactive notifications for at-risk accounts and upsell opportunities"
  },
  {
    icon: Database,
    title: "Unified Data Source",
    description: "Single source of truth for all consumption and billing data"
  },
  {
    icon: Zap,
    title: "API-First Design",
    description: "Integrate seamlessly with your existing tools and workflows"
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Secure, scalable infrastructure built for high-growth companies"
  }
];

export const FeatureShowcase = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Power Your Go-To-Market Strategy
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything your teams need to drive revenue from usage data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.title} 
              className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="pt-6">
                <div className="mb-4 p-3 rounded-xl bg-gradient-primary w-fit group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
