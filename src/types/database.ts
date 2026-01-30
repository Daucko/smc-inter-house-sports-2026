export interface House {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  created_at: string;
}

export interface EventResult {
  id: string;
  event_id: string;
  house_id: string;
  position: number;
  points: number;
  headline: string | null;
  created_at: string;
}

export interface EventResultWithDetails extends EventResult {
  events: Event;
  houses: House;
}

export interface HouseStanding {
  house: House;
  gold: number;
  silver: number;
  bronze: number;
  totalPoints: number;
}

export const POINTS_SYSTEM = {
  1: 5, // Gold
  2: 3, // Silver
  3: 1, // Bronze
} as const;
