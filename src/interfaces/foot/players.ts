export interface Player {
  player_id: number;
  player_url: string;

  fifa_version: number;
  fifa_update: number;
  fifa_update_date: string;

  short_name: string;
  long_name: string;
  player_positions: string;

  overall: number;
  potential: number;

  value_eur: number | null;
  wage_eur: number | null;

  age: number;
  dob: string;

  height_cm: number;
  weight_kg: number;

  league_id: number | null;
  league_name: string | null;
  league_level: number | null;

  club_team_id: number | null;
  club_name: string | null;
  club_position: string | null;
  club_jersey_number: number | null;
  club_loaned_from: string | null;
  club_joined_date: string | null;
  club_contract_valid_until_year: number | null;

  nationality_id: number;
  nationality_name: string;

  nation_team_id: number | null;
  nation_position: string | null;
  nation_jersey_number: number | null;

  preferred_foot: string;
  weak_foot: number;
  skill_moves: number;
  international_reputation: number;

  work_rate: string | null;
  body_type: string | null;
  real_face: string | null;

  release_clause_eur: number | null;

  player_tags: string | null;
  player_traits: string | null;

  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physic: number | null;

  attacking_crossing: number;
  attacking_finishing: number;
  attacking_heading_accuracy: number;
  attacking_short_passing: number;
  attacking_volleys: number;

  skill_dribbling: number;
  skill_curve: number;
  skill_fk_accuracy: number;
  skill_long_passing: number;
  skill_ball_control: number;

  movement_acceleration: number;
  movement_sprint_speed: number;
  movement_agility: number;
  movement_reactions: number;
  movement_balance: number;

  power_shot_power: number;
  power_jumping: number;
  power_stamina: number;
  power_strength: number;
  power_long_shots: number;

  mentality_aggression: number;
  mentality_interceptions: number;
  mentality_positioning: number;
  mentality_vision: number;
  mentality_penalties: number;
  mentality_composure: number;

  defending_marking_awareness: number;
  defending_standing_tackle: number;
  defending_sliding_tackle: number;

  goalkeeping_diving: number;
  goalkeeping_handling: number;
  goalkeeping_kicking: number;
  goalkeeping_positioning: number;
  goalkeeping_reflexes: number;
  goalkeeping_speed: number | null;

  ls: string;
  st: string;
  rs: string;
  lw: string;
  lf: string;
  cf: string;
  rf: string;
  rw: string;

  lam: string;
  cam: string;
  ram: string;

  lm: string;
  lcm: string;
  cm: string;
  rcm: string;
  rm: string;

  lwb: string;
  ldm: string;
  cdm: string;
  rdm: string;
  rwb: string;

  lb: string;
  lcb: string;
  cb: string;
  rcb: string;
  rb: string;

  gk: string;
  club_league_name: string | null;
  country_league_id: number | null;
  country_league_name: string | null;
  club_logo: string | null;
  player_face_url: string;
  nationality_alpha2: string | null;
  nationality_alpha3: string | null;
  nationality_flag_url: string | null;
  short_name_normalized: string;
  club_name_normalized: string | null;
  league_name_normalized: string | null;
  nationality_name_normalized: string;
}
