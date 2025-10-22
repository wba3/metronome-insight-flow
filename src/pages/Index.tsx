import { Hero } from "@/components/Hero";
import { MetricsCards } from "@/components/MetricsCards";
import { UsageChart } from "@/components/UsageChart";
import { CommitDrawdown } from "@/components/CommitDrawdown";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { MetronomeSync } from "@/components/MetronomeSync";

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
