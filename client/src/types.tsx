export interface Runner {
    id: number;
    name: string;
    age: number;
    number: string,
    email: string;
    category: string;
    events: RaceEvent[];
}
  
export interface RaceEvent {
    id: number;
    name: string;
    date: string;
    distance: number;
    location: {
        city: string;
        country: string;
    };
    track: {
        name: string;
        distance: number;
        difficulty_level: string;
    };
    runners: Runner[];
}

export interface Result {
    runner_id: number;
    runner_name: string;
    position: number;
    finish_time: string;
  }
