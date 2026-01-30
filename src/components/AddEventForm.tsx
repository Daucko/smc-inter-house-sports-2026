import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { House, POINTS_SYSTEM } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trophy, Medal, Award, Sparkles } from 'lucide-react';

interface AddEventFormProps {
  onEventAdded: () => void;
}

export function AddEventForm({ onEventAdded }: AddEventFormProps) {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [houses, setHouses] = useState<House[]>([]);
  const [firstPlace, setFirstPlace] = useState('');
  const [secondPlace, setSecondPlace] = useState('');
  const [thirdPlace, setThirdPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const data = await api.get('/houses');
      setHouses(data as House[]);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim()) {
      toast({ title: 'Error', description: 'Please enter an event name.', variant: 'destructive' });
      return;
    }

    if (!firstPlace || !secondPlace || !thirdPlace) {
      toast({ title: 'Error', description: 'Please select houses for all positions.', variant: 'destructive' });
      return;
    }

    if (new Set([firstPlace, secondPlace, thirdPlace]).size !== 3) {
      toast({ title: 'Error', description: 'Each position must have a different house.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      // Send to backend which will handle creation and any headline generation
      await api.post('/events', {
        name: eventName,
        date: eventDate,
        results: [
          { houseId: firstPlace, position: 1, points: POINTS_SYSTEM[1] },
          { houseId: secondPlace, position: 2, points: POINTS_SYSTEM[2] },
          { houseId: thirdPlace, position: 3, points: POINTS_SYSTEM[3] },
        ]
      });

      toast({
        title: 'Event Added!',
        description: `${eventName} results recorded.`,
      });

      // Reset form
      setEventName('');
      setFirstPlace('');
      setSecondPlace('');
      setThirdPlace('');
      onEventAdded();
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add event.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableHouses = (excludeIds: string[]) => {
    return houses.filter((h) => !excludeIds.includes(h.id));
  };

  return (
    <div className="bg-gradient-card border border-border rounded-2xl p-6">
      <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-primary" />
        Add New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              placeholder="e.g., 100m Sprint"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
        </div>

        {/* Position Selects */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-6 h-6 medal-gold rounded-full flex items-center justify-center">
                <Trophy className="w-3 h-3" />
              </div>
              1st Place (5 pts)
            </Label>
            <Select value={firstPlace} onValueChange={setFirstPlace}>
              <SelectTrigger>
                <SelectValue placeholder="Select house" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableHouses([secondPlace, thirdPlace]).map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: house.color }}
                      />
                      {house.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-6 h-6 medal-silver rounded-full flex items-center justify-center">
                <Medal className="w-3 h-3" />
              </div>
              2nd Place (3 pts)
            </Label>
            <Select value={secondPlace} onValueChange={setSecondPlace}>
              <SelectTrigger>
                <SelectValue placeholder="Select house" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableHouses([firstPlace, thirdPlace]).map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: house.color }}
                      />
                      {house.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-6 h-6 medal-bronze rounded-full flex items-center justify-center">
                <Award className="w-3 h-3" />
              </div>
              3rd Place (1 pt)
            </Label>
            <Select value={thirdPlace} onValueChange={setThirdPlace}>
              <SelectTrigger>
                <SelectValue placeholder="Select house" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableHouses([firstPlace, secondPlace]).map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: house.color }}
                      />
                      {house.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isGeneratingHeadlines ? 'Generating Headlines...' : 'Adding Event...'}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Add Event & Generate Headlines
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
