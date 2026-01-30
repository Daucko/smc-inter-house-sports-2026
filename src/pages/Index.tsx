import { Header } from '@/components/Header';
import { MedalTable } from '@/components/MedalTable';
import { PointsLegend } from '@/components/PointsLegend';
import { NewsHeadlines } from '@/components/NewsHeadlines';
import { Trophy, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">2024 Season</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Inter-House{' '}
            <span className="text-gradient-gold">Sports Competition</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track the battle for glory. Every medal counts in the race to become champions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Medal Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  Medal Standings
                </h2>
              </div>
              
              <PointsLegend />
              <MedalTable />
            </div>

            {/* News Section */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                AI Headlines
              </h2>
              <NewsHeadlines />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
