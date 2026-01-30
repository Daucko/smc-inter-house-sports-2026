import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { EventResultWithDetails } from '@/types/database';
import { format } from 'date-fns';
import { Calendar, Trophy, Medal, Award, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function EventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      // Assuming a DELETE endpoint exists
      await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast({ title: 'Event deleted successfully' });
      fetchEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="w-6 h-6 medal-gold rounded-full flex items-center justify-center">
            <Trophy className="w-3 h-3" />
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 medal-silver rounded-full flex items-center justify-center">
            <Medal className="w-3 h-3" />
          </div>
        );
      case 3:
        return (
          <div className="w-6 h-6 medal-bronze rounded-full flex items-center justify-center">
            <Award className="w-3 h-3" />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-card border border-border rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card border border-border rounded-2xl p-6">
      <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Recent Events
      </h2>

      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No events yet. Add your first event above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-secondary/50 border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {event.results.map((result: any) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    {getMedalIcon(result.position)}
                    <div
                      className="w-2 h-4 rounded-full"
                      style={{ backgroundColor: result.house.color }}
                    />
                    <span>{result.house.name}</span>
                    <span className="text-muted-foreground">({result.points} pts)</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
