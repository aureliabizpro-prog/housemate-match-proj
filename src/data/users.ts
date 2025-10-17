// ============================================
// 好室友® V2.0.0 - 用戶數據
// ============================================

import { User, LifestyleScale } from '../types';

/**
 * 用戶數據庫
 * 數據來源: Google 表單 (test-matchhousemate-01.md + olddata.csv)
 *
 * 注意：以下為測試數據，確認格式後將擴充至全部 50+ 位用戶
 */
export const users: User[] = [
  // ========== 新問卷用戶 (有完整欄位) ==========

  {
    userId: 'han***',
    email: 'han911522@gmail.com',

    // 性別相關
    sex_assigned_at_birth: 'SAF',
    gender_identity: 'F',
    roommate_gender_preference: 'ANY',

    // 硬性條件
    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['松山區', '中山區'],
    allergies: ['ALLERGY_DUST'],
    smoking_habit: 'SMOKING_NONE',

    // 生活習慣 (1-5 量表)
    q9_cleaning: 1,        // 看到髒就立刻掃
    q10_visitors: 5,       // 沒限制，隨時都能帶
    q11_pets: 5,          // 自己有養/超愛動物
    q12_schedule: 3,       // 正常作息
    q13_interaction: 3,    // 偶爾會聊天
    q14_noise_sensitivity: 5,  // 幾乎不受噪音影響
    q15_bathroom_pref: 5,      // 完全沒有限制

    // 輔助資訊
    q16_roommate_experience: 'CURRENTLY_LIVING_SEEKING_NEW',
    bio: '從事影視業，作息不固定，可能半夜才要出門上班，也可能凌晨才下班回家。有養一隻馬爾濟斯，不親人也不親動物，平常固定在廁所大小便，希望室友可以接受在公共區域活動。期待合租的室友是可以一同維護環境的人。',

    // AI 生成推薦
    recommendation: '他希望室友關係是「舒適的距離感」——不會過度干涉，但需要時能互相支持。像是那種「各自獨立，偶爾一起煮飯」的自在相處。'
  },

  {
    userId: 'rub***',
    email: 'ruby61428@gmail.com',

    sex_assigned_at_birth: 'SAF',
    gender_identity: 'F',
    roommate_gender_preference: 'GIF_ONLY',

    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['中正區', '萬華區', '板橋區'],
    allergies: ['ALLERGY_NONE'],
    smoking_habit: 'SMOKING_NONE',

    q9_cleaning: 3,
    q10_visitors: 2,
    q11_pets: 3,
    q12_schedule: 3,
    q13_interaction: 2,
    q14_noise_sensitivity: 3,
    q15_bathroom_pref: 3,

    q16_roommate_experience: 'EXTENDED_EXPERIENCE',
    bio: '在台北做行銷相關工作。對合租的想像是希望可以一起維護共同生活的環境，也可以提供彼此在異鄉的基本支持。希望是可以申請租補的房子、三樓以下、有廚房。',
    recommendation: '他在尋找一種「彼此尊重界線」的相處模式。願意配合、溝通，但也需要自己的私密空間。適合成熟、有默契的室友關係。'
  },

  {
    userId: 'yuc***',
    email: 'yuchun1020243@gmail.com',

    sex_assigned_at_birth: 'SAF',
    gender_identity: 'F',
    roommate_gender_preference: 'SAF_ONLY',

    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['南港區', '汐止', '松山區'],
    allergies: ['ALLERGY_FOOD'],
    smoking_habit: 'SMOKING_NONE',

    q9_cleaning: 3,
    q10_visitors: 2,
    q11_pets: 3,
    q12_schedule: 3,
    q13_interaction: 3,
    q14_noise_sensitivity: 2,  // 休息時需要相對安靜
    q15_bathroom_pref: 2,      // 有偏好但可協調

    q16_roommate_experience: 'EXTENDED_EXPERIENCE',
    bio: 'INFJ，25歲，科技業工程師。睡眠時間需要比較安靜的環境，希望不要有大力的關門聲與腳步聲。愛乾淨，碗盤不會放到隔天才洗。',
    move_in_date: '2025-12-01',
    recommendation: '他展現出內向者的特質——需要獨處充電，但也願意適度互動。重視邊界感和個人空間。適合同樣理解「安靜的力量」的你。'
  },

  {
    userId: 'pom***',
    email: 'pomelo4187@gmail.com',

    sex_assigned_at_birth: 'SAF',
    gender_identity: 'F',
    roommate_gender_preference: 'GIF_ONLY',

    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['台北捷運沿線'],
    allergies: ['ALLERGY_DUST', 'ALLERGY_OTHER'],
    smoking_habit: 'SMOKING_NONE',

    q9_cleaning: 2,        // 固定一週打掃一次
    q10_visitors: 2,
    q11_pets: 5,
    q12_schedule: 4,       // 偏晚睡晚起
    q13_interaction: 3,
    q14_noise_sensitivity: 4,
    q15_bathroom_pref: 4,  // 會主動規劃避開熱門時段

    q16_roommate_experience: 'EXTENDED_EXPERIENCE',
    bio: '有養2隻貓，需要陽光充足，有電梯，有管理員方便收包裹的租屋。因為有養貓，所以對環境整潔很在意，我怕蟑螂。愛烹飪。',
    move_in_date: '2025-11-01',
    recommendation: '他的生活中心是「家的溫度」——毛孩、烹飪、陽光。希望室友也能享受這種慢生活的節奏。適合同樣珍惜居家時光的你。'
  },

  {
    userId: 'wnv***',
    email: 'wnvivian0104@gmail.com',

    sex_assigned_at_birth: 'SAF',
    gender_identity: 'F',
    roommate_gender_preference: 'SAF_ONLY',

    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['大安區', '中正區', '中永和'],
    allergies: ['ALLERGY_NONE'],
    smoking_habit: 'SMOKING_NONE',

    q9_cleaning: 2,
    q10_visitors: 3,
    q11_pets: 1,          // 完全不能接受
    q12_schedule: 2,       // 偏早睡早起
    q13_interaction: 3,
    q14_noise_sensitivity: 2,
    q15_bathroom_pref: 2,

    q16_roommate_experience: 'EXTENDED_EXPERIENCE',
    bio: '',
    move_in_date: '2025-11-01',
    recommendation: '早睡早起的規律生活者，重視生活品質和安靜環境。希望環境中沒有寵物。適合同樣作息規律、追求生活平衡的你。'
  },

  // ========== 舊問卷用戶 (缺少部分欄位，使用預設值) ==========

  {
    userId: 'viv***',
    email: 'viviloveexce@gmail.com',

    sex_assigned_at_birth: 'SAM',
    gender_identity: 'M',
    roommate_gender_preference: 'ANY',

    rent_budget_range: 'SHARE_10K_12K',
    location_preferences: ['三重', '中山', '社子'],
    allergies: ['ALLERGY_NONE'],  // 舊問卷無此欄位，預設無
    smoking_habit: 'SMOKING_NONE',  // 舊問卷無此欄位，預設無

    q9_cleaning: 5,        // 很隨性，沒有固定掃地時間
    q10_visitors: 3,       // OK，只要互相尊重就好
    q11_pets: 5,          // 自己有養
    q12_schedule: 1,       // 極度早睡早起 (9-10點睡)
    q13_interaction: 3,    // 偶爾會聊天
    q14_noise_sensitivity: 3,  // 缺失值，填補為 3
    q15_bathroom_pref: 3,      // 缺失值，填補為 3

    q16_roommate_experience: 'CURRENTLY_LIVING_SEEKING_NEW',
    bio: '34歲男子，單身不婚，有兩隻貓，還有一台 Switch。目前正在找房，搬家時間預計最快在2026年。養兩隻貓，定期清貓砂、偶爾自煮、也會打掃。',
    recommendation: '34歲的成熟室友，有豐富合租經驗。「會幫忙丟垃圾」的穩定型角色，適合想要靠譜夥伴的你。貓奴專屬加分！'
  }
];

/**
 * 根據 userId 查找用戶
 */
export function getUserById(userId: string): User | undefined {
  return users.find(user => user.userId === userId);
}

/**
 * 根據 email 查找用戶
 */
export function getUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

/**
 * 獲取所有用戶 ID 列表
 */
export function getAllUserIds(): string[] {
  return users.map(user => user.userId);
}

/**
 * 根據地區篩選用戶
 */
export function getUsersByLocation(location: string): User[] {
  return users.filter(user =>
    user.location_preferences.some(loc =>
      loc.includes(location) || location.includes(loc)
    )
  );
}

/**
 * 獲取平台統計資訊
 */
export function getPlatformStats() {
  return {
    totalUsers: users.length,
    uniqueLocations: Array.from(new Set(users.flatMap(u => u.location_preferences))),
    budgetDistribution: users.reduce((acc, u) => {
      acc[u.rent_budget_range] = (acc[u.rent_budget_range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

/**
 * 匿名化顯示 - 只顯示前 3 個字符 + ***
 * @param email 原始 email 或 userId
 * @returns 匿名化後的顯示名稱
 */
export function anonymizeUserId(email?: string): string {
  if (!email) return '***';

  // 如果是 email，取 @ 前的部分
  const username = email.includes('@') ? email.split('@')[0] : email;

  // 只取前 3 個字符
  const prefix = username.substring(0, 3);

  return `${prefix}***`;
}
