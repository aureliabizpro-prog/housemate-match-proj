import { User } from '@/types/user';

export const usersData: User[] = [
  {
    id: 'USER001',
    email: 'user001@example.com',
    gender_identity: 'F',
    sex_assigned_at_birth: 'SAF',
    roommate_gender_preference: 'GIF_ONLY',
    location_preferences: ['台北市大安區', '台北市信義區'],
    rent_budget_range: 'SHARE_10K_12K',
    q9_cleaning: 4,
    q10_visitors: 3,
    q11_pets: 2,
    q12_schedule: 4,
    q13_interaction: 3,
    bio: '喜歡安靜的環境，平常會在家工作，希望找個生活習慣相近的室友。'
  },
  {
    id: 'USER002',
    email: 'user002@example.com',
    gender_identity: 'F',
    sex_assigned_at_birth: 'SAF',
    roommate_gender_preference: 'ANY',
    location_preferences: ['台北市大安區', '台北市中正區'],
    rent_budget_range: 'SHARE_10K_12K',
    q9_cleaning: 5,
    q10_visitors: 2,
    q11_pets: 1,
    q12_schedule: 3,
    q13_interaction: 4,
    bio: '上班族，希望找個愛乾淨、好相處的室友一起分租。'
  },
  {
    id: 'USER003',
    email: 'user003@example.com',
    gender_identity: 'M',
    sex_assigned_at_birth: 'SAM',
    roommate_gender_preference: 'ANY',
    location_preferences: ['新北市板橋區', '新北市中和區'],
    rent_budget_range: 'SHARE_8K_10K',
    q9_cleaning: 3,
    q10_visitors: 4,
    q11_pets: 3,
    q12_schedule: 3,
    q13_interaction: 4,
    bio: '研究生，作息正常，偶爾會有朋友來訪。'
  },
  {
    id: 'USER004',
    email: 'user004@example.com',
    gender_identity: 'F',
    sex_assigned_at_birth: 'SAF',
    roommate_gender_preference: 'SAF_ONLY',
    location_preferences: ['台北市信義區', '台北市松山區'],
    rent_budget_range: 'SHARE_12K_15K',
    q9_cleaning: 4,
    q10_visitors: 2,
    q11_pets: 1,
    q12_schedule: 4,
    q13_interaction: 3,
    bio: '外商上班族，希望找個安靜、愛乾淨的室友。'
  },
  {
    id: 'USER005',
    email: 'user005@example.com',
    gender_identity: 'M',
    sex_assigned_at_birth: 'SAM',
    roommate_gender_preference: 'GIM_ONLY',
    location_preferences: ['台北市中山區', '台北市大同區'],
    rent_budget_range: 'SHARE_10K_12K',
    q9_cleaning: 3,
    q10_visitors: 3,
    q11_pets: 4,
    q12_schedule: 2,
    q13_interaction: 5,
    bio: '喜歡養寵物，希望找個也喜歡動物的室友。'
  },
  {
    id: 'USER006',
    email: 'user006@example.com',
    gender_identity: 'M',
    sex_assigned_at_birth: 'SAM',
    roommate_gender_preference: 'SAF_ONLY',
    location_preferences: ['台北市萬華區'],
    rent_budget_range: 'SHARE_GT22K',
    q9_cleaning: 1,
    q10_visitors: 5,
    q11_pets: 5,
    q12_schedule: 1,
    q13_interaction: 1,
    bio: '自由工作者，作息不定時，經常有朋友來訪。'
  },
  {
    id: 'TEST_NOMATCH',
    email: 'nomatch@test.com',
    gender_identity: 'NB',  // 非二元性別
    sex_assigned_at_birth: 'SAF',
    roommate_gender_preference: 'SAM_ONLY',  // 只要生理男性室友
    location_preferences: ['基隆市'],
    rent_budget_range: 'SHARE_LT8K',
    q9_cleaning: 5,
    q10_visitors: 1,
    q11_pets: 1,
    q12_schedule: 5,
    q13_interaction: 1,
    bio: '測試用戶：此用戶應該無法與任何人配對（用於測試 noMatches 狀態）'
  }
];

export const calculateMatchScore = (user1: User, user2: User): number => {
  let score = 0;
  let maxScore = 0;

  // Gender Preference Match (40%)
  maxScore += 40;
  const genderMatch =
    user1.roommate_gender_preference === 'ANY' ||
    (user1.roommate_gender_preference === 'GIF_ONLY' && user2.gender_identity === 'F') ||
    (user1.roommate_gender_preference === 'GIM_ONLY' && user2.gender_identity === 'M') ||
    (user1.roommate_gender_preference === 'SAF_ONLY' && user2.sex_assigned_at_birth === 'SAF') ||
    (user1.roommate_gender_preference === 'SAM_ONLY' && user2.sex_assigned_at_birth === 'SAM');
  if (genderMatch) score += 40;

  // Bidirectional check for gender preference
  const reverseGenderMatch =
    user2.roommate_gender_preference === 'ANY' ||
    (user2.roommate_gender_preference === 'GIF_ONLY' && user1.gender_identity === 'F') ||
    (user2.roommate_gender_preference === 'GIM_ONLY' && user1.gender_identity === 'M') ||
    (user2.roommate_gender_preference === 'SAF_ONLY' && user1.sex_assigned_at_birth === 'SAF') ||
    (user2.roommate_gender_preference === 'SAM_ONLY' && user1.sex_assigned_at_birth === 'SAM');
  if (!reverseGenderMatch) return 0; // If preferences don't match bidirectionally, score is 0

  // Location Preference (20%)
  maxScore += 20;
  const locationMatch = user1.location_preferences.some(loc1 =>
    user2.location_preferences.some(loc2 =>
      loc1.includes(loc2) || loc2.includes(loc1)
    )
  );
  if (locationMatch) score += 20;

  // Rent Budget (15%)
  maxScore += 15;
  if (user1.rent_budget_range === user2.rent_budget_range) {
    score += 15;
  } else {
    const budgetNum = (str: string) => parseInt(str.match(/\d+/)?.[0] || '0');
    const budgetDiff = Math.abs(budgetNum(user1.rent_budget_range) - budgetNum(user2.rent_budget_range));
    if (budgetDiff <= 2000) score += 10;
    else if (budgetDiff <= 4000) score += 5;
  }

  // Living Habits (25%)
  maxScore += 25;
  const habitQuestions = ['q9_cleaning', 'q10_visitors', 'q11_pets', 'q12_schedule', 'q13_interaction'];
  let habitScore = 0;
  habitQuestions.forEach(q => {
    // @ts-expect-error - accessing dynamic property
    const diff = Math.abs((user1[q] || 3) - (user2[q] || 3)); // Default to 3 if not set
    habitScore += Math.max(0, 5 - diff); // Max 5 points per question, less for larger diff
  });
  score += (habitScore / (5 * habitQuestions.length)) * 25; // Normalize to 25%

  return Math.round((score / maxScore) * 100);
};

export const getGenderDisplay = (user: User) => {
  if (user.gender_identity === 'NB') return '非二元性別';
  if (user.gender_identity === 'F') return '女性';
  if (user.gender_identity === 'M') return '男性';
  return '未指定';
};

export const getRoommatePreferenceDisplay = (pref: User['roommate_gender_preference']) => {
  const map = {
    'ANY': '不拘',
    'GIF_ONLY': '性別認同為女性',
    'GIM_ONLY': '性別認同為男性',
    'SAF_ONLY': '生理女性',
    'SAM_ONLY': '生理男性'
  };
  return map[pref] || pref;
};

export const getBudgetDisplay = (budget: User['rent_budget_range']) => {
  const map = {
    'SHARE_LT8K': '$8,000以下',
    'SHARE_8K_10K': '$8,000-$10,000',
    'SHARE_10K_12K': '$10,001-$12,000',
    'SHARE_12K_15K': '$12,001-$15,000',
    'SHARE_15K_18K': '$15,001-$18,000',
    'SHARE_18K_22K': '$18,001-$22,000',
    'SHARE_GT22K': '$22,000以上'
  };
  return map[budget] || budget;
};

export const obfuscateEmail = (email: string): string => {
  const parts = email.split('@');
  if (parts.length !== 2) return email; // Not a valid email
  const username = parts[0];
  if (username.length <= 3) return username + '***';
  return username.substring(0, 3) + '***';
};
