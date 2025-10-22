import { Hero } from "@/components/Hero";
import { MetricsCards } from "@/components/MetricsCards";
import { UsageChart } from "@/components/UsageChart";
import { CommitDrawdown } from "@/components/CommitDrawdown";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { MetronomeSync } from "@/components/MetronomeSync";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MetronomeSync />
      </div>
      <MetricsCards />
      <UsageChart />
      <CommitDrawdown />
      <FeatureShowcase />
      
      {/* Embeddable Dashboards CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">Embeddable Customer Dashboards</CardTitle>
            <CardDescription className="text-lg mt-2">
              Share Metronome data with your customers through customizable embeddable dashboards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2">📊 Invoice Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  View current and historical invoices up to 90 days old
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2">📈 Usage Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track usage metrics for the past 30, 60, or 90 days
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <h3 className="font-semibold mb-2">💰 Commits & Credits</h3>
                <p className="text-sm text-muted-foreground">
                  View balances, grant history, and access schedules
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link to="/embeddable">
                <Button size="lg" className="gap-2">
                  Try Embeddable Dashboards
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to transform your usage data?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              See how Metronome's API-powered dashboards can drive revenue intelligence for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://docs.metronome.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Explore API Documentation
              </a>
              <a 
                href="https://metronome.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-border hover:bg-accent transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>Built with Metronome API • Powered by real-time usage data</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
