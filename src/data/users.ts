import { User, LifestyleAnswer } from '../types';

/**
 * 將數字轉換為生活方式答案
 */
function numberToLifestyleAnswer(num: number): LifestyleAnswer {
  const mapping: Record<number, LifestyleAnswer> = {
    1: "非常不同意",
    2: "不同意",
    3: "中立",
    4: "同意",
    5: "非常同意"
  };
  return mapping[num] || "中立";
}

/**
 * 所有用戶數據
 * 未來可以從 API 或資料庫獲取
 */
export const users: User[] = [
  {
    userId: 'han911522',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'ANY',
    q4_location_pref: ['松山區', '中山區'],
    q5_budget: '10k-15k',
    q6_bio: '從事影視業，有養馬爾濟斯',
    q9_cleaning: '非常不同意',
    q10_visitors: '非常同意',
    q11_pets: '非常同意',
    q12_schedule: '中立',
    q13_interaction: '中立'
  },
  {
    userId: 'viviloveexce',
    q1_gender_identity: '男',
    q2_sex_at_birth: '男',
    q3_gender_pref: 'GIF_ONLY',
    q4_location_pref: ['中山區'],
    q5_budget: '10k-15k',
    q6_bio: '34歲男性，有兩隻貓',
    q9_cleaning: '中立',
    q10_visitors: '中立',
    q11_pets: '中立',
    q12_schedule: '中立',
    q13_interaction: '中立'
  },
  {
    userId: 'willy233',
    q1_gender_identity: '找不到',
    q2_sex_at_birth: '男',
    q3_gender_pref: 'ANY',
    q4_location_pref: ['文山區'],
    q5_budget: '10k-15k',
    q6_bio: '現有空間找新室友',
    q9_cleaning: '非常不同意',
    q10_visitors: '不同意',
    q11_pets: '非常同意',
    q12_schedule: '中立',
    q13_interaction: '中立'
  },
  {
    userId: 'ruby61428',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'GIF_ONLY',
    q4_location_pref: ['中正區', '萬華區'],
    q5_budget: '10k-15k',
    q6_bio: '台北行銷工作',
    q9_cleaning: '中立',
    q10_visitors: '不同意',
    q11_pets: '中立',
    q12_schedule: '中立',
    q13_interaction: '不同意'
  },
  {
    userId: 'chiyau0829',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'SAF_ONLY',
    q4_location_pref: ['信義區'],
    q5_budget: '10k-15k',
    q6_bio: '',
    q9_cleaning: '非常同意',
    q10_visitors: '不同意',
    q11_pets: '非常同意',
    q12_schedule: '同意',
    q13_interaction: '不同意'
  },
  {
    userId: 'yuchun1020243',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'SAF_ONLY',
    q4_location_pref: ['南港區', '松山區'],
    q5_budget: '10k-15k',
    q6_bio: '科技業工程師',
    q9_cleaning: '中立',
    q10_visitors: '不同意',
    q11_pets: '中立',
    q12_schedule: '中立',
    q13_interaction: '中立'
  },
  {
    userId: 'pomelo4187',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'GIF_ONLY',
    q4_location_pref: ['大安區', '信義區'],
    q5_budget: '10k-15k',
    q6_bio: '有養2隻貓，愛烹飪',
    q9_cleaning: '不同意',
    q10_visitors: '不同意',
    q11_pets: '非常同意',
    q12_schedule: '同意',
    q13_interaction: '中立'
  },
  {
    userId: 'forever93176',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'SAF_ONLY',
    q4_location_pref: ['南港區', '松山區'],
    q5_budget: '10k-15k',
    q6_bio: '希望可以一起煮飯',
    q9_cleaning: '非常不同意',
    q10_visitors: '中立',
    q11_pets: '中立',
    q12_schedule: '中立',
    q13_interaction: '中立'
  },
  {
    userId: 'wnvivian0104',
    q1_gender_identity: '女',
    q2_sex_at_birth: '女',
    q3_gender_pref: 'SAF_ONLY',
    q4_location_pref: ['大安區', '中正區'],
    q5_budget: '10k-15k',
    q6_bio: '',
    q9_cleaning: '不同意',
    q10_visitors: '中立',
    q11_pets: '非常不同意',
    q12_schedule: '不同意',
    q13_interaction: '中立'
  }
];

/**
 * 根據 userId 查找用戶
 */
export function getUserById(userId: string): User | undefined {
  return users.find(user => user.userId === userId);
}

/**
 * 獲取所有用戶 ID 列表
 */
export function getAllUserIds(): string[] {
  return users.map(user => user.userId);
}
