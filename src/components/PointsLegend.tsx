import { Trophy, Medal, Award } from 'lucide-react';

export function PointsLegend() {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-4">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">
        POINTS SYSTEM
      </h3>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 medal-gold rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold">1st</span>
            <span className="text-muted-foreground ml-2">5 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 medal-silver rounded-full flex items-center justify-center">
            <Medal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold">2nd</span>
            <span className="text-muted-foreground ml-2">3 pts</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 medal-bronze rounded-full flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold">3rd</span>
            <span className="text-muted-foreground ml-2">1 pt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
