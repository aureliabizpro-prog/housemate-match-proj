// ============================================
// 好室友® V2.0.0 - 類型定義系統
// ============================================

// ========== 性別相關類型 ==========

/**
 * 生理性別 (Sex Assigned at Birth)
 */
export type SexAssignedAtBirth = "SAM" | "SAF" | "PNTS_SAAB";

/**
 * 性別認同 (Gender Identity)
 */
export type GenderIdentity = "M" | "F" | "NB" | "PNTS_GI" | "OTHER_GI";

/**
 * 可見性設定 (僅用於非二元性別用戶)
 */
export interface VisibilitySettings {
  visible_to_GIM_pref: boolean;  // 願意被尋找「性別認同為男性」的用戶看見
  visible_to_GIF_pref: boolean;  // 願意被尋找「性別認同為女性」的用戶看見
  visible_to_SAM_pref: boolean;  // 願意被尋找「生理男性」的用戶看見
  visible_to_SAF_pref: boolean;  // 願意被尋找「生理女性」的用戶看見
}

/**
 * 室友性別偏好
 */
export type RoommateGenderPreference =
  | "GIM_ONLY"  // 限性別認同為男性
  | "GIF_ONLY"  // 限性別認同為女性
  | "SAM_ONLY"  // 限生理男性
  | "SAF_ONLY"  // 限生理女性
  | "ANY";      // 不拘

// ========== 生活習慣與偏好類型 ==========

/**
 * 租金預算範圍
 */
export type RentBudgetRange =
  | "SHARE_LT8K"      // $8,000 以下
  | "SHARE_8K_10K"    // $8,000 - $10,000
  | "SHARE_10K_12K"   // $10,001 - $12,000
  | "SHARE_12K_15K"   // $12,001 - $15,000
  | "SHARE_15K_18K"   // $15,001 - $18,000
  | "SHARE_18K_22K"   // $18,001 - $22,000
  | "SHARE_GT22K";    // $22,001 以上

/**
 * 生活習慣量表 (1-5 分)
 * 1 = 非常不同意/極端A
 * 5 = 非常同意/極端B
 */
export type LifestyleScale = 1 | 2 | 3 | 4 | 5;

/**
 * 過敏原類型
 */
export type AllergyType =
  | "ALLERGY_NONE"          // 無
  | "ALLERGY_FOOD"          // 特定食物
  | "ALLERGY_PET_DANDER"    // 寵物毛髮/皮屑
  | "ALLERGY_DUST"          // 塵蟎
  | "ALLERGY_POLLEN"        // 花粉
  | "ALLERGY_CHEMICALS"     // 清潔劑/化學品
  | "ALLERGY_OTHER";        // 其他

/**
 * 抽菸習慣
 */
export type SmokingHabit =
  | "SMOKING_NONE"                  // 無
  | "SMOKING_COMPLIANT_OUTDOORS"    // 有，但遵守公約不在室內抽
  | "SMOKING_SOMETIMES_INDOORS";    // 有，有時在室內抽

/**
 * 合租經驗
 */
export type RoommateExperience =
  | "NO_EXPERIENCE"                    // 從未有過
  | "BRIEF_EXPERIENCE"                 // 有過但時間不長 (一年以下)
  | "EXTENDED_EXPERIENCE"              // 一年以上
  | "CURRENTLY_LIVING_SEEKING_NEW";    // 目前正與室友合租中

// ========== 用戶核心接口 ==========

/**
 * 完整用戶資料
 * 符合 PRD V3 與 master_prompt V3 規範
 */
export interface User {
  // ===== 基本資訊 =====
  userId: string;                                  // 用戶唯一識別碼 (通常是 email 的遮罩版)
  email?: string;                                  // 用戶 email (可選，用於搜尋)

  // ===== 性別相關 (PRD V3 Section 2.1) =====
  sex_assigned_at_birth: SexAssignedAtBirth;       // Q1: 生理性別
  gender_identity: GenderIdentity;                  // Q2: 性別認同
  visibility_settings?: VisibilitySettings;         // Q3: 可見性設定 (僅當 gender_identity 為 NB/PNTS_GI/OTHER_GI 時)
  roommate_gender_preference: RoommateGenderPreference;  // Q4: 室友性別偏好

  // ===== 硬性條件 (PRD V3 Section 2.3-2.6) =====
  rent_budget_range: RentBudgetRange;              // Q5: 租金預算範圍
  location_preferences: string[];                   // Q6: 地區偏好 (多選)
  allergies: AllergyType[];                        // Q7: 過敏原 (多選)
  smoking_habit: SmokingHabit;                     // Q8: 抽菸習慣

  // ===== 生活習慣向量 (PRD V3 Section 3.2) =====
  q9_cleaning: LifestyleScale;                     // Q9: 清潔習慣 (1=立刻掃, 5=隨性)
  q10_visitors: LifestyleScale;                    // Q10: 訪客頻率 (1=不帶人, 5=隨時帶)
  q11_pets: LifestyleScale;                        // Q11: 寵物態度 (1=不接受, 5=超愛)
  q12_schedule: LifestyleScale;                    // Q12: 作息時間 (1=早睡早起, 5=夜貓子)
  q13_interaction: LifestyleScale;                 // Q13: 互動期望 (1=互不打擾, 5=像家人)
  q14_noise_sensitivity: LifestyleScale;           // Q14: 噪音敏感度 (1=極度敏感, 5=不介意)
  q15_bathroom_pref: LifestyleScale;              // Q15: 衛浴使用偏好 (1=固定時段, 5=無限制)
  q15_bathroom_fixed_timeslot?: string;           // Q15子問題: 不可妥協時段 (若有)

  // ===== 輔助資訊 =====
  q16_roommate_experience: RoommateExperience;    // Q16: 合租經驗
  bio: string;                                     // Q17: 自我介紹
  move_in_date?: string;                          // 預計入住時間 (YYYY-MM-DD)

  // ===== AI 生成內容 =====
  recommendation?: string;                         // 好室友®推薦文案 (由 LLM 生成)
}

// ========== 配對結果接口 ==========

/**
 * 配對分數細分
 */
export interface ScoreBreakdown {
  genderCompatible: boolean;          // 性別偏好是否雙向匹配
  locationOverlap: number;            // 地點重疊數量
  budgetMatch: boolean;               // 預算範圍是否重疊
  allergyCompatible: boolean;         // 過敏原是否相容
  smokingCompatible: boolean;         // 抽菸習慣是否相容
  lifestyleDistance: number;          // 生活習慣向量距離 (越小越相似)
}

/**
 * 配對結果
 */
export interface MatchResult {
  user1: User;
  user2: User;
  score: number;                      // 整體相似度分數 (0-100)
  breakdown: ScoreBreakdown;          // 分數細分
  passHardFilters: boolean;           // 是否通過所有硬性篩選
}

// ========== UI 相關類型 ==========

/**
 * 視圖模式
 */
export type ViewMode = "all" | "individual";

/**
 * 展示用的性別標籤
 */
export interface GenderDisplayLabel {
  identity: string;        // 例如: "女"
  preference: string;      // 例如: "找不拘"
}

// ========== 工具函數類型 ==========

/**
 * 配對篩選選項
 */
export interface MatchingOptions {
  minScore?: number;              // 最低分數門檻
  topN?: number;                  // 返回前 N 個配對
  includeNonPassingFilters?: boolean;  // 是否包含未通過硬性篩選的結果
}

/**
 * 統計資訊
 */
export interface PlatformStats {
  totalUsers: number;
  highScoreMatches: number;
  averageScore: number;
}

// ========== 數據驗證類型 ==========

/**
 * 問卷原始數據 (從 Google Sheets 來的格式)
 */
export interface FormRawData {
  Timestamp: string;
  Username: string;
  [key: string]: string | undefined;  // 其他問卷欄位
}

/**
 * 數據轉換錯誤
 */
export interface DataConversionError {
  userId: string;
  field: string;
  originalValue: any;
  error: string;
}
