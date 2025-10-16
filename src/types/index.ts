// 用戶偏好設置類型
export type GenderPreference = "ANY" | "GIF_ONLY" | "GIM_ONLY" | "SAF_ONLY" | "SAM_ONLY";
export type Location = "松山區" | "信義區" | "大安區" | "中山區" | "中正區" | "大同區" | "萬華區" | "文山區" | "南港區" | "內湖區" | "士林區" | "北投區";
export type BudgetRange = "10k-15k" | "15k-20k" | "20k-25k" | "25k+";
export type LifestyleAnswer = "非常不同意" | "不同意" | "中立" | "同意" | "非常同意";

// 用戶接口
export interface User {
  userId: string;
  q1_gender_identity: string;
  q2_sex_at_birth: string;
  q3_gender_pref: GenderPreference;
  q4_location_pref: Location[];
  q5_budget: BudgetRange;
  q6_bio: string;
  q9_cleaning: LifestyleAnswer;
  q10_visitors: LifestyleAnswer;
  q11_pets: LifestyleAnswer;
  q12_schedule: LifestyleAnswer;
  q13_interaction: LifestyleAnswer;
}

// 配對結果接口
export interface MatchResult {
  user1: User;
  user2: User;
  score: number;
  breakdown: ScoreBreakdown;
}

// 分數細分接口
export interface ScoreBreakdown {
  genderMatch: number;
  locationMatch: number;
  budgetMatch: number;
  lifestyleMatch: number;
}

// 視圖模式類型
export type ViewMode = "all" | "individual";
