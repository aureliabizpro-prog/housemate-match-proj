// ============================================
// 好室友® V2.0.0 - 顯示輔助函數
// ============================================

import {
  User,
  GenderIdentity,
  RoommateGenderPreference,
  RentBudgetRange,
  AllergyType,
  SmokingHabit,
  RoommateExperience,
  LifestyleScale
} from '../types';

// ========== 性別相關顯示 ==========

/**
 * 將性別認同轉換為顯示文字
 */
export function getGenderIdentityLabel(identity: GenderIdentity): string {
  const labels: Record<GenderIdentity, string> = {
    'M': '男',
    'F': '女',
    'NB': '非二元',
    'PNTS_GI': '不願透露',
    'OTHER_GI': '其他'
  };
  return labels[identity];
}

/**
 * 將室友性別偏好轉換為顯示文字
 */
export function getRoommatePreferenceLabel(preference: RoommateGenderPreference): string {
  const labels: Record<RoommateGenderPreference, string> = {
    'GIM_ONLY': '限性別認同為男性',
    'GIF_ONLY': '限性別認同為女性',
    'SAM_ONLY': '限生理男性',
    'SAF_ONLY': '限生理女性',
    'ANY': '不拘'
  };
  return labels[preference];
}

/**
 * 獲取性別顯示標籤 (用於卡片)
 * @param user 用戶
 * @returns 顯示文字，例如 "女 · 找不拘"
 */
export function getGenderDisplayLabel(user: User): string {
  const identity = getGenderIdentityLabel(user.gender_identity);
  const preference = getRoommatePreferenceLabel(user.roommate_gender_preference);
  return `${identity} · 找${preference}`;
}

// ========== 租金預算顯示 ==========

/**
 * 將租金預算範圍轉換為顯示文字
 */
export function getBudgetLabel(budget: RentBudgetRange): string {
  const labels: Record<RentBudgetRange, string> = {
    'SHARE_LT8K': '$8,000 以下',
    'SHARE_8K_10K': '$8,000 - $10,000',
    'SHARE_10K_12K': '$10,000 - $12,000',
    'SHARE_12K_15K': '$12,000 - $15,000',
    'SHARE_15K_18K': '$15,000 - $18,000',
    'SHARE_18K_22K': '$18,000 - $22,000',
    'SHARE_GT22K': '$22,000 以上'
  };
  return labels[budget];
}

// ========== 過敏原顯示 ==========

/**
 * 將過敏原類型轉換為顯示文字
 */
export function getAllergyLabel(allergy: AllergyType): string {
  const labels: Record<AllergyType, string> = {
    'ALLERGY_NONE': '無',
    'ALLERGY_FOOD': '特定食物',
    'ALLERGY_PET_DANDER': '寵物毛髮/皮屑',
    'ALLERGY_DUST': '塵蟎',
    'ALLERGY_POLLEN': '花粉',
    'ALLERGY_CHEMICALS': '清潔劑/化學品',
    'ALLERGY_OTHER': '其他'
  };
  return labels[allergy];
}

/**
 * 獲取用戶過敏原列表顯示
 */
export function getAllergiesDisplay(allergies: AllergyType[]): string {
  if (allergies.includes('ALLERGY_NONE')) {
    return '無';
  }
  return allergies.map(a => getAllergyLabel(a)).join('、');
}

// ========== 抽菸習慣顯示 ==========

/**
 * 將抽菸習慣轉換為顯示文字
 */
export function getSmokingLabel(habit: SmokingHabit): string {
  const labels: Record<SmokingHabit, string> = {
    'SMOKING_NONE': '不抽菸',
    'SMOKING_COMPLIANT_OUTDOORS': '有抽菸（僅戶外）',
    'SMOKING_SOMETIMES_INDOORS': '有抽菸（含室內）'
  };
  return labels[habit];
}

// ========== 合租經驗顯示 ==========

/**
 * 將合租經驗轉換為顯示文字
 */
export function getExperienceLabel(experience: RoommateExperience): string {
  const labels: Record<RoommateExperience, string> = {
    'NO_EXPERIENCE': '從未合租',
    'BRIEF_EXPERIENCE': '短期經驗（一年以下）',
    'EXTENDED_EXPERIENCE': '長期經驗（一年以上）',
    'CURRENTLY_LIVING_SEEKING_NEW': '目前正與室友合租中'
  };
  return labels[experience];
}

// ========== 生活習慣量表顯示 ==========

/**
 * Q9: 清潔習慣描述
 */
export function getCleaningLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '看到髒就立刻掃',
    2: '固定一週打掃一次',
    3: '大概兩週打掃一次',
    4: '看情況，不一定',
    5: '很隨性，沒有固定掃地時間'
  };
  return labels[score];
}

/**
 * Q10: 訪客頻率描述
 */
export function getVisitorsLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '完全不會帶人回家',
    2: '很少，偶爾才會',
    3: 'OK，只要互相尊重就好',
    4: '還算常，但會先告知',
    5: '沒限制，隨時都能帶'
  };
  return labels[score];
}

/**
 * Q11: 寵物態度描述
 */
export function getPetsLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '完全不能接受寵物',
    2: '不太喜歡，但可以接受',
    3: '中立，看情況',
    4: '喜歡，也樂意幫忙照顧',
    5: '自己有養/超愛動物'
  };
  return labels[score];
}

/**
 * Q12: 作息時間描述
 */
export function getScheduleLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '極度早睡早起（9-10點睡）',
    2: '偏早睡早起',
    3: '正常作息（11-12點睡）',
    4: '偏晚睡晚起',
    5: '夜貓子（凌晨1-2點後才睡）'
  };
  return labels[score];
}

/**
 * Q13: 互動期望描述
 */
export function getInteractionLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '最好互不打擾',
    2: '簡單問候就好',
    3: '偶爾會聊天',
    4: '期待一起做些事（煮飯、追劇）',
    5: '希望像家人般親近'
  };
  return labels[score];
}

/**
 * Q14: 噪音敏感度描述
 */
export function getNoiseSensitivityLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '極度敏感，需要絕對安靜',
    2: '休息時需要相對安靜',
    3: '一般，不要太誇張就好',
    4: '不太在意一般生活噪音',
    5: '幾乎不受噪音影響'
  };
  return labels[score];
}

/**
 * Q15: 衛浴使用偏好描述
 */
export function getBathroomLabel(score: LifestyleScale): string {
  const labels: Record<LifestyleScale, string> = {
    1: '有固定使用時段，無法妥協',
    2: '有偏好但可協調',
    3: '彈性，可以配合',
    4: '會主動規劃避開熱門時段',
    5: '完全沒有限制'
  };
  return labels[score];
}

// ========== 顏色與圖標工具 ==========

/**
 * 根據相似度分數獲取顏色
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#E08E6D'; // orange
  if (score >= 40) return '#f59e0b'; // amber
  return '#6b7280'; // gray
}

/**
 * 根據相似度分數獲取評級文字
 */
export function getScoreRating(score: number): string {
  if (score >= 90) return '絕配';
  if (score >= 80) return '極佳';
  if (score >= 70) return '很好';
  if (score >= 60) return '不錯';
  if (score >= 50) return '普通';
  return '較低';
}

// ========== 日期格式化 ==========

/**
 * 格式化入住日期
 */
export function formatMoveInDate(dateString?: string): string {
  if (!dateString) return '未指定';

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
  } catch {
    return dateString;
  }
}

// ========== 完整用戶資訊摘要 ==========

/**
 * 生成用戶的完整資訊摘要
 */
export function generateUserSummary(user: User): {
  basic: string[];
  lifestyle: string[];
  preferences: string[];
} {
  return {
    basic: [
      `性別：${getGenderDisplayLabel(user)}`,
      `預算：${getBudgetLabel(user.rent_budget_range)}`,
      `地區：${user.location_preferences.join('、')}`,
      `入住時間：${formatMoveInDate(user.move_in_date)}`
    ],
    lifestyle: [
      `清潔：${getCleaningLabel(user.q9_cleaning)}`,
      `訪客：${getVisitorsLabel(user.q10_visitors)}`,
      `寵物：${getPetsLabel(user.q11_pets)}`,
      `作息：${getScheduleLabel(user.q12_schedule)}`,
      `互動：${getInteractionLabel(user.q13_interaction)}`,
      `噪音：${getNoiseSensitivityLabel(user.q14_noise_sensitivity)}`,
      `衛浴：${getBathroomLabel(user.q15_bathroom_pref)}`
    ],
    preferences: [
      `過敏原：${getAllergiesDisplay(user.allergies)}`,
      `抽菸：${getSmokingLabel(user.smoking_habit)}`,
      `經驗：${getExperienceLabel(user.q16_roommate_experience)}`
    ]
  };
}
