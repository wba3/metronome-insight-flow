import { Hero } from "@/components/Hero";
import { MetricsCards } from "@/components/MetricsCards";
import { UsageChart } from "@/components/UsageChart";
import { CommitDrawdown } from "@/components/CommitDrawdown";
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
      
      {/* Main Content - Streamlined */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        <MetricsCards />
        <UsageChart />
        <CommitDrawdown />
        
        {/* Embeddable Dashboards CTA - Elevated */}
        <Card className="premium-card border-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
          <CardHeader className="text-center relative z-10 pt-10">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <Monitor className="h-7 w-7 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">Embeddable Customer Dashboards</CardTitle>
            <CardDescription className="mt-2 max-w-2xl mx-auto">
              Share Metronome data with your customers through customizable embeddable dashboards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10 pb-10">
            <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
              <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                <h3 className="text-sm font-semibold mb-1.5">Invoice Dashboard</h3>
                <p className="text-xs text-muted-foreground">
                  Current and historical invoices
                </p>
              </div>
              <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                <h3 className="text-sm font-semibold mb-1.5">Usage Dashboard</h3>
                <p className="text-xs text-muted-foreground">
                  Track usage metrics over time
                </p>
              </div>
              <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                <h3 className="text-sm font-semibold mb-1.5">Commits & Credits</h3>
                <p className="text-xs text-muted-foreground">
                  Balances and grant history
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <Link to="/embeddable">
                <Button size="lg" className="gap-2 shadow-lg">
                  View Embeddable Dashboards
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer - Simplified */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">Ready to transform your usage data?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              See how Metronome's API-powered dashboards can drive revenue intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="https://docs.metronome.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Explore API Documentation
              </a>
              <a 
                href="https://metronome.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium border border-border hover:bg-accent/5 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            <p>Built with Metronome API</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
