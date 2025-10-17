// ============================================
// 好室友® V2.0.0 - 配對演算法
// 符合 PRD V3 規範
// ============================================

import { User, MatchResult, ScoreBreakdown, RoommateGenderPreference, MatchingOptions } from '../types';

// ========== LAYER 1: 硬性篩選 (Hard Filters) ==========

/**
 * 檢查性別相容性 (支援非二元性別與可見性設定)
 * @param preferrer 有偏好的用戶
 * @param candidate 被檢查的候選人
 * @returns 候選人是否符合偏好者的性別偏好
 */
export function isGenderCompatible(
  preferrer: User,
  candidate: User
): boolean {
  const preference = preferrer.roommate_gender_preference;

  // 不拘性別
  if (preference === 'ANY') {
    return true;
  }

  // 限性別認同為男性
  if (preference === 'GIM_ONLY') {
    if (candidate.gender_identity === 'M') return true;
    // 非二元用戶可能選擇向 GIM_pref 可見
    if (['NB', 'PNTS_GI', 'OTHER_GI'].includes(candidate.gender_identity)) {
      return candidate.visibility_settings?.visible_to_GIM_pref ?? false;
    }
    return false;
  }

  // 限性別認同為女性
  if (preference === 'GIF_ONLY') {
    if (candidate.gender_identity === 'F') return true;
    // 非二元用戶可能選擇向 GIF_pref 可見
    if (['NB', 'PNTS_GI', 'OTHER_GI'].includes(candidate.gender_identity)) {
      return candidate.visibility_settings?.visible_to_GIF_pref ?? false;
    }
    return false;
  }

  // 限生理男性
  if (preference === 'SAM_ONLY') {
    if (candidate.sex_assigned_at_birth === 'SAM') return true;
    // 非二元用戶可能選擇向 SAM_pref 可見
    if (['NB', 'PNTS_GI', 'OTHER_GI'].includes(candidate.gender_identity)) {
      return candidate.visibility_settings?.visible_to_SAM_pref ?? false;
    }
    return false;
  }

  // 限生理女性
  if (preference === 'SAF_ONLY') {
    if (candidate.sex_assigned_at_birth === 'SAF') return true;
    // 非二元用戶可能選擇向 SAF_pref 可見
    if (['NB', 'PNTS_GI', 'OTHER_GI'].includes(candidate.gender_identity)) {
      return candidate.visibility_settings?.visible_to_SAF_pref ?? false;
    }
    return false;
  }

  return false;
}

/**
 * 檢查兩位用戶是否能互相看見 (雙向性別匹配)
 * @param userA 用戶A
 * @param userB 用戶B
 * @returns 是否通過雙向性別檢查
 */
export function canSeeEachOther(userA: User, userB: User): boolean {
  const aCanSeeB = isGenderCompatible(userA, userB);
  const bCanSeeA = isGenderCompatible(userB, userA);
  return aCanSeeB && bCanSeeA;
}

/**
 * 檢查地點偏好是否有重疊
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 重疊的地點數量
 */
export function checkLocationOverlap(user1: User, user2: User): number {
  const overlap = user1.location_preferences.filter(loc =>
    user2.location_preferences.some(otherLoc =>
      loc.includes(otherLoc) || otherLoc.includes(loc)
    )
  );
  return overlap.length;
}

/**
 * 檢查租金預算是否有重疊
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 預算範圍是否重疊
 */
export function checkBudgetOverlap(user1: User, user2: User): boolean {
  // 簡化版：完全相同算重疊
  // 進階版可以考慮範圍交集 (例如 10K-12K 與 12K-15K 有部分重疊)
  return user1.rent_budget_range === user2.rent_budget_range;
}

/**
 * 檢查過敏原相容性
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 是否相容 (若有人對寵物過敏，對方有養寵物則不相容)
 */
export function checkAllergyCompatibility(user1: User, user2: User): boolean {
  // 檢查 user1 是否對寵物過敏，但 user2 有養寵物
  const user1PetAllergy = user1.allergies.includes('ALLERGY_PET_DANDER');
  const user2HasPets = user2.q11_pets === 5; // 5 = 自己有養/超愛動物

  if (user1PetAllergy && user2HasPets) return false;

  // 檢查 user2 是否對寵物過敏，但 user1 有養寵物
  const user2PetAllergy = user2.allergies.includes('ALLERGY_PET_DANDER');
  const user1HasPets = user1.q11_pets === 5;

  if (user2PetAllergy && user1HasPets) return false;

  // 其他過敏原暫不作為硬性篩選條件
  return true;
}

/**
 * 檢查抽菸習慣相容性
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 是否相容
 */
export function checkSmokingCompatibility(user1: User, user2: User): boolean {
  // 若任一方在室內抽菸，對方必須也接受室內抽菸
  if (user1.smoking_habit === 'SMOKING_SOMETIMES_INDOORS') {
    return user2.smoking_habit !== 'SMOKING_NONE';
  }
  if (user2.smoking_habit === 'SMOKING_SOMETIMES_INDOORS') {
    return user1.smoking_habit !== 'SMOKING_NONE';
  }
  // 其他組合都相容
  return true;
}

/**
 * 檢查是否通過所有硬性篩選
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 是否通過所有硬性條件
 */
export function passHardFilters(user1: User, user2: User): boolean {
  return (
    canSeeEachOther(user1, user2) &&
    checkLocationOverlap(user1, user2) > 0 &&
    checkBudgetOverlap(user1, user2) &&
    checkAllergyCompatibility(user1, user2) &&
    checkSmokingCompatibility(user1, user2)
  );
}

// ========== LAYER 2: 生活習慣相似度計算 ==========

/**
 * 計算歐氏距離 (Euclidean Distance)
 * 用於衡量兩位用戶在 7 個生活習慣維度上的差異
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 歐氏距離 (越小越相似，範圍 0 ~ √196 ≈ 14)
 */
export function calculateLifestyleDistance(user1: User, user2: User): number {
  const dimensions = [
    'q9_cleaning',
    'q10_visitors',
    'q11_pets',
    'q12_schedule',
    'q13_interaction',
    'q14_noise_sensitivity',
    'q15_bathroom_pref'
  ] as const;

  const sumOfSquares = dimensions.reduce((sum, dim) => {
    const diff = (user1[dim] ?? 3) - (user2[dim] ?? 3); // 缺失值填補為 3
    return sum + diff * diff;
  }, 0);

  return Math.sqrt(sumOfSquares);
}

/**
 * 將歐氏距離轉換為 0-100 的相似度分數
 * @param distance 歐氏距離
 * @returns 相似度分數 (0-100)
 */
export function distanceToScore(distance: number): number {
  // 最大距離約為 14 (每個維度差 4 分的情況)
  // 使用反比例轉換: score = 100 * (1 - distance / maxDistance)
  const maxDistance = Math.sqrt(7 * 16); // √(7 * 4²) ≈ 10.58
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  return Math.round(100 * (1 - normalizedDistance));
}

// ========== 主要配對函數 ==========

/**
 * 計算兩位用戶的詳細配對結果
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 配對結果，包含分數和細項分析
 */
export function calculateMatch(user1: User, user2: User): MatchResult {
  const genderCompatible = canSeeEachOther(user1, user2);
  const locationOverlap = checkLocationOverlap(user1, user2);
  const budgetMatch = checkBudgetOverlap(user1, user2);
  const allergyCompatible = checkAllergyCompatibility(user1, user2);
  const smokingCompatible = checkSmokingCompatibility(user1, user2);
  const lifestyleDistance = calculateLifestyleDistance(user1, user2);

  const breakdown: ScoreBreakdown = {
    genderCompatible,
    locationOverlap,
    budgetMatch,
    allergyCompatible,
    smokingCompatible,
    lifestyleDistance
  };

  const passFilters = passHardFilters(user1, user2);
  const score = passFilters ? distanceToScore(lifestyleDistance) : 0;

  return {
    user1,
    user2,
    score,
    breakdown,
    passHardFilters: passFilters
  };
}

/**
 * 為特定用戶找出最佳配對
 * @param targetUser 目標用戶
 * @param allUsers 所有用戶列表
 * @param options 配對選項
 * @returns 配對結果數組，按分數降序排列
 */
export function findMatchesForUser(
  targetUser: User,
  allUsers: User[],
  options: MatchingOptions = {}
): MatchResult[] {
  const {
    minScore = 0,
    topN = 10,
    includeNonPassingFilters = false
  } = options;

  const matches: MatchResult[] = [];

  for (const user of allUsers) {
    if (user.userId === targetUser.userId) continue;

    const match = calculateMatch(targetUser, user);

    // 根據選項決定是否包含未通過硬性篩選的結果
    if (includeNonPassingFilters || match.passHardFilters) {
      if (match.score >= minScore) {
        matches.push(match);
      }
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * 找出所有用戶之間的配對
 * @param users 用戶列表
 * @param options 配對選項
 * @returns 配對結果數組，按分數降序排列
 */
export function findAllMatches(
  users: User[],
  options: MatchingOptions = {}
): MatchResult[] {
  const {
    minScore = 60,
    includeNonPassingFilters = false
  } = options;

  const matches: MatchResult[] = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const match = calculateMatch(users[i], users[j]);

      if (includeNonPassingFilters || match.passHardFilters) {
        if (match.score >= minScore) {
          matches.push(match);
        }
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * 獲取配對統計資訊
 * @param matches 配對結果列表
 * @returns 統計資訊
 */
export function getMatchingStats(matches: MatchResult[]) {
  const passingMatches = matches.filter(m => m.passHardFilters);
  const scores = passingMatches.map(m => m.score);

  return {
    totalMatches: matches.length,
    passingHardFilters: passingMatches.length,
    averageScore: scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0,
    highScoreMatches: passingMatches.filter(m => m.score >= 80).length
  };
}
