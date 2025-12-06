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

// Browse Mode (for third-party visitors who haven't filled the questionnaire)
export interface BrowseUserCard {
  userId: string;
  tagInfo: {
    gender: '生理女' | '生理男' | '非二元';
    highlightFeature: string;  // e.g., "養馬爾濟斯", "行銷工作者"
    highlightEmoji?: string;
  };
  matchStats: {
    averageMatchScore: number;   // 平均契合度 0-100
    potentialMatchCount: number; // 潛在配對數量 (score >= 60)
  };
  preferences: string[];  // 4-5 items, excluding info already in tag
  suitableFor: {
    description: string;
    location: string;
    budgetRange: string;
  };
  pronoun: '他' | '她' | 'TA';
}

// Match Recommendation Mode (for registered users who filled the questionnaire)
export interface ScoreBreakdown {
  genderPreference: number;  // 0-40
  location: number;          // 0-20
  budget: number;            // 0-15
  lifestyle: number;         // 0-25
}

export interface MatchRecommendation {
  matchId: string;
  matchedUser: {
    email: string;  // obfuscated
    userId: string;
  };
  matchScore: number;  // 0-100
  scoreBreakdown: ScoreBreakdown;
  whyRecommended: string[];  // 3-5 items
  lifestyle: {
    schedule: string;
    cleaning: string;
    pets: string;
    interaction: string;
  };
  quote?: string;
  matchDate: string;  // ISO 8601
}
