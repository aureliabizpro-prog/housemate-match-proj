export interface User {
  id: string;
  email: string;
  gender_identity: 'F' | 'M' | 'NB'; // Female, Male, Non-binary
  sex_assigned_at_birth: 'SAF' | 'SAM'; // Sex Assigned Female, Sex Assigned Male
  roommate_gender_preference: 'ANY' | 'GIF_ONLY' | 'GIM_ONLY' | 'SAF_ONLY' | 'SAM_ONLY';
  location_preferences: string[];
  rent_budget_range: 'SHARE_LT8K' | 'SHARE_8K_10K' | 'SHARE_10K_12K' | 'SHARE_12K_15K' | 'SHARE_15K_18K' | 'SHARE_18K_22K' | 'SHARE_GT22K';
  q9_cleaning: number; // 1-5 scale
  q10_visitors: number; // 1-5 scale
  q11_pets: number; // 1-5 scale
  q12_schedule: number; // 1-5 scale
  q13_interaction: number; // 1-5 scale
  bio: string;
  // Additional fields from Claude discussion
  q14_noise_sensitivity?: number; // 1-5 scale
  q15_bathroom_pref?: number; // 1-4 scale
  q16_roommate_experience?: number; // 1-4 scale
  allergies?: string; // Free text
  smoking_habit?: string; // Free text
  expected_move_in_date?: string; // YYYY-MM-DD
}

export interface MatchedUser extends User {
  matchScore: number;
}
