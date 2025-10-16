import { User, MatchResult, ScoreBreakdown, GenderPreference, LifestyleAnswer } from '../types';

/**
 * 檢查性別/性傾向配對是否符合
 * @param user 當前用戶
 * @param otherUser 配對對象
 * @returns 是否符合配對條件
 */
export function checkGenderPreferenceMatch(user: User, otherUser: User): boolean {
  const checkPref = (pref: GenderPreference, sex: string, genderIdentity: string): boolean => {
    if (pref === "ANY") return true;
    if (pref === "GIF_ONLY") return genderIdentity === "女";
    if (pref === "GIM_ONLY") return genderIdentity === "男";
    if (pref === "SAF_ONLY") return sex === "女";
    if (pref === "SAM_ONLY") return sex === "男";
    return false;
  };

  const user1MatchesUser2Pref = checkPref(
    otherUser.q3_gender_pref,
    user.q2_sex_at_birth,
    user.q1_gender_identity
  );

  const user2MatchesUser1Pref = checkPref(
    user.q3_gender_pref,
    otherUser.q2_sex_at_birth,
    otherUser.q1_gender_identity
  );

  return user1MatchesUser2Pref && user2MatchesUser1Pref;
}

/**
 * 計算地點偏好重疊分數
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 地點重疊分數 (0-20)
 */
export function calculateLocationScore(user1: User, user2: User): number {
  const overlap = user1.q4_location_pref.filter(loc =>
    user2.q4_location_pref.includes(loc)
  );
  return overlap.length > 0 ? 20 : 0;
}

/**
 * 計算預算匹配分數
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 預算匹配分數 (0-15)
 */
export function calculateBudgetScore(user1: User, user2: User): number {
  return user1.q5_budget === user2.q5_budget ? 15 : 0;
}

/**
 * 計算生活方式問題的匹配分數
 * @param answer1 用戶1的答案
 * @param answer2 用戶2的答案
 * @returns 單個問題的匹配分數 (0-5)
 */
export function calculateLifestyleQuestionScore(answer1: LifestyleAnswer, answer2: LifestyleAnswer): number {
  const scale: Record<LifestyleAnswer, number> = {
    "非常不同意": 1,
    "不同意": 2,
    "中立": 3,
    "同意": 4,
    "非常同意": 5
  };

  const diff = Math.abs(scale[answer1] - scale[answer2]);

  if (diff === 0) return 5;
  if (diff === 1) return 3;
  if (diff === 2) return 1;
  return 0;
}

/**
 * 計算所有生活方式問題的總分
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 生活方式總分 (0-25)
 */
export function calculateLifestyleScore(user1: User, user2: User): number {
  const questions: Array<keyof Pick<User, 'q9_cleaning' | 'q10_visitors' | 'q11_pets' | 'q12_schedule' | 'q13_interaction'>> = [
    'q9_cleaning',
    'q10_visitors',
    'q11_pets',
    'q12_schedule',
    'q13_interaction'
  ];

  const totalScore = questions.reduce((sum, question) => {
    return sum + calculateLifestyleQuestionScore(user1[question], user2[question]);
  }, 0);

  return totalScore;
}

/**
 * 計算兩個用戶的總匹配分數
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 匹配分數 (0-100) 或 0 (如果性別偏好不匹配)
 */
export function calculateMatchScore(user1: User, user2: User): number {
  // 性別/性傾向偏好必須匹配，否則返回 0
  if (!checkGenderPreferenceMatch(user1, user2)) {
    return 0;
  }

  const locationScore = calculateLocationScore(user1, user2);
  const budgetScore = calculateBudgetScore(user1, user2);
  const lifestyleScore = calculateLifestyleScore(user1, user2);
  const genderScore = 40; // 性別匹配得滿分

  return genderScore + locationScore + budgetScore + lifestyleScore;
}

/**
 * 計算匹配分數並返回詳細分數細分
 * @param user1 用戶1
 * @param user2 用戶2
 * @returns 匹配結果，包含總分和各項細分
 */
export function calculateDetailedMatch(user1: User, user2: User): MatchResult {
  const breakdown: ScoreBreakdown = {
    genderMatch: checkGenderPreferenceMatch(user1, user2) ? 40 : 0,
    locationMatch: calculateLocationScore(user1, user2),
    budgetMatch: calculateBudgetScore(user1, user2),
    lifestyleMatch: calculateLifestyleScore(user1, user2)
  };

  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    user1,
    user2,
    score,
    breakdown
  };
}

/**
 * 找出所有超過門檻的配對
 * @param users 用戶列表
 * @param minScore 最低分數門檻
 * @returns 配對結果數組，按分數降序排列
 */
export function findAllMatches(users: User[], minScore: number): MatchResult[] {
  const matches: MatchResult[] = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const match = calculateDetailedMatch(users[i], users[j]);
      if (match.score >= minScore) {
        matches.push(match);
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * 為特定用戶找出最佳配對
 * @param targetUser 目標用戶
 * @param allUsers 所有用戶列表
 * @param topN 返回前N個最佳配對
 * @returns 配對結果數組，按分數降序排列
 */
export function findMatchesForUser(targetUser: User, allUsers: User[], topN: number = 5): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const user of allUsers) {
    if (user.userId === targetUser.userId) continue;

    const match = calculateDetailedMatch(targetUser, user);
    if (match.score > 0) {
      matches.push(match);
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
