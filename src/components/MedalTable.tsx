import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { House, HouseStanding } from '@/types/database';
import { Trophy, Medal, Award } from 'lucide-react';

export function MedalTable() {
  const [standings, setStandings] = useState<HouseStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const houses = await api.get('/houses');
      const events = await api.get('/events');

      const standingsMap = new Map<string, HouseStanding>();

      (houses as House[]).forEach((house) => {
        standingsMap.set(house.id, {
          house,
          gold: 0,
          silver: 0,
          bronze: 0,
          totalPoints: 0,
        });
      });

      // Aggregate results from all events
      (events as any[]).forEach((event) => {
        event.results.forEach((result: any) => {
          const standing = standingsMap.get(result.houseId);
          if (standing) {
            if (result.position === 1) standing.gold++;
            else if (result.position === 2) standing.silver++;
            else if (result.position === 3) standing.bronze++;
            standing.totalPoints += result.points;
          }
        });
      });

      const sortedStandings = Array.from(standingsMap.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints
      );

      setStandings(sortedStandings);
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 shimmer rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {standings.map((standing, index) => (
        <div
          key={standing.house.id}
          className="bg-gradient-card border border-border rounded-xl p-4 hover-lift animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary font-display font-bold text-lg">
                {index + 1}
              </div>

              {/* House Color & Name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-12 rounded-full"
                  style={{ backgroundColor: standing.house.color }}
                />
                <span className="font-display font-semibold text-lg">
                  {standing.house.name}
                </span>
              </div>
            </div>

            {/* Medals */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 medal-gold rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="font-semibold w-6 text-center">{standing.gold}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 medal-silver rounded-full flex items-center justify-center">
                  <Medal className="w-4 h-4" />
                </div>
                <span className="font-semibold w-6 text-center">{standing.silver}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 medal-bronze rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-semibold w-6 text-center">{standing.bronze}</span>
              </div>

              {/* Total Points */}
              <div className="min-w-[80px] text-right">
                <span className="text-2xl font-display font-bold text-gradient-gold">
                  {standing.totalPoints}
                </span>
                <span className="text-sm text-muted-foreground ml-1">pts</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {standings.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No results yet. Add events to see standings!</p>
        </div>
      )}
    </div>
  );
}
