import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EventResultWithDetails } from '@/types/database';
import { Newspaper, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export function NewsHeadlines() {
  const [headlines, setHeadlines] = useState<EventResultWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    try {
      const events = await api.get('/events');
      const allResultsWithHeadlines = events.flatMap((event: any) =>
        event.results
          .filter((r: any) => r.headline)
          .map((r: any) => ({
            ...r,
            events: { id: event.id, name: event.name, date: event.date },
            house: r.house
          }))
      ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setHeadlines(allResultsWithHeadlines);
    } catch (error) {
      console.error('Error fetching headlines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 shimmer rounded-lg" />
        ))}
      </div>
    );
  }

  if (headlines.length === 0) {
    return (
      <div className="bg-gradient-card border border-border rounded-xl p-6 text-center">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary opacity-70" />
        <p className="text-muted-foreground">
          AI-generated headlines will appear here when new events are added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {headlines.map((item, index) => (
        <div
          key={item.id}
          className="bg-gradient-card border border-border rounded-xl p-4 hover-lift animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getMedalEmoji(item.position)}</div>
            <div className="flex-1">
              <p className="font-medium leading-snug">{item.headline}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Newspaper className="w-3 h-3" />
                <span>{item.events.name}</span>
                <span>•</span>
                <span>{format(new Date(item.events.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
