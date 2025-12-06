/**
 * Mock API Response Transformers
 * These functions simulate the backend API responses until the real API is implemented.
 * They transform User data into BrowseUserCard and MatchRecommendation formats.
 */

import { User, BrowseUserCard, MatchRecommendation, ScoreBreakdown } from '@/types/user';
import { calculateMatchScore, usersData, getBudgetDisplay } from './matching';

/**
 * Transform User to BrowseUserCard (Browse Mode for third-party visitors)
 */
export const transformToBrowseUserCard = (user: User): BrowseUserCard => {
  // Calculate average match score with all other users
  const otherUsers = usersData.filter(u => u.id !== user.id);
  const scores = otherUsers.map(otherUser => calculateMatchScore(user, otherUser));
  const averageMatchScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );
  const potentialMatchCount = scores.filter(score => score >= 60).length;

  // Generate tag info
  const tagInfo = generateTagInfo(user);

  // Generate preferences (excluding info already in tag)
  const preferences = generatePreferences(user, tagInfo.highlightFeature);

  // Generate "suitable for" description
  const suitableFor = generateSuitableFor(user);

  // Determine pronoun
  const pronoun = getPronoun(user);

  return {
    userId: user.id,
    tagInfo,
    matchStats: {
      averageMatchScore,
      potentialMatchCount,
    },
    preferences,
    suitableFor,
    pronoun,
  };
};

/**
 * Transform match data to MatchRecommendation (Match Mode for registered users)
 */
export const transformToMatchRecommendation = (
  currentUser: User,
  matchedUser: User,
  obfuscatedEmail: string
): MatchRecommendation => {
  const matchScore = calculateMatchScore(currentUser, matchedUser);
  const scoreBreakdown = calculateScoreBreakdown(currentUser, matchedUser);
  const whyRecommended = generateWhyRecommended(currentUser, matchedUser, scoreBreakdown);
  const lifestyle = extractLifestyle(matchedUser);
  const quote = extractQuote(matchedUser.bio);

  return {
    matchId: `${currentUser.id}_${matchedUser.id}_${new Date().toISOString().split('T')[0]}`,
    matchedUser: {
      email: obfuscatedEmail,
      userId: matchedUser.id,
    },
    matchScore,
    scoreBreakdown,
    whyRecommended,
    lifestyle,
    quote,
    matchDate: new Date().toISOString(),
  };
};

/**
 * Generate comprehensive tag info (gender + highlight feature)
 */
const generateTagInfo = (user: User): BrowseUserCard['tagInfo'] => {
  const gender = user.sex_assigned_at_birth === 'SAF'
    ? '生理女'
    : user.sex_assigned_at_birth === 'SAM'
    ? '生理男'
    : '非二元';

  // Priority: pets > occupation > special status
  let highlightFeature = '';
  let highlightEmoji = '';

  // Check for pets
  if (user.q11_pets >= 4) {
    highlightFeature = '超愛寵物';
    highlightEmoji = '🐾';
  } else if (user.bio.includes('養') && (user.bio.includes('貓') || user.bio.includes('狗'))) {
    const petMatch = user.bio.match(/養(.*?)([貓狗])/);
    if (petMatch) {
      highlightFeature = `養${petMatch[1]}${petMatch[2]}`;
      highlightEmoji = petMatch[2] === '貓' ? '🐱' : '🐕';
    }
  }
  // Check for occupation
  else if (user.bio.includes('工程師')) {
    highlightFeature = '軟體工程師';
    highlightEmoji = '💻';
  } else if (user.bio.includes('上班族')) {
    highlightFeature = '上班族';
    highlightEmoji = '💼';
  } else if (user.bio.includes('研究生') || user.bio.includes('學生')) {
    highlightFeature = '研究生';
    highlightEmoji = '📚';
  } else if (user.bio.includes('外商')) {
    highlightFeature = '外商工作者';
    highlightEmoji = '💼';
  }
  // Special status
  else if (user.bio.includes('現有') && user.bio.includes('空間')) {
    highlightFeature = '現有空間找室友';
    highlightEmoji = '🏠';
  }
  // Default
  else {
    highlightFeature = '尋找室友中';
    highlightEmoji = '👋';
  }

  return {
    gender,
    highlightFeature,
    highlightEmoji,
  };
};

/**
 * Generate preferences list (4-5 items, excluding tag info)
 */
const generatePreferences = (user: User, highlightFeature: string): string[] => {
  const preferences: string[] = [];

  // Schedule
  if (user.q12_schedule <= 2) {
    preferences.push('作息晚睡晚起');
  } else if (user.q12_schedule >= 4) {
    preferences.push('作息規律正常');
  }

  // Cleaning (avoid if already mentioned pets in tag)
  if (user.q9_cleaning >= 4 && !highlightFeature.includes('寵物')) {
    preferences.push('看到髒就立刻掃，重視環境整潔');
  } else if (user.q9_cleaning <= 2) {
    preferences.push('清潔習慣較隨性');
  }

  // Visitors
  if (user.q10_visitors >= 4) {
    preferences.push('歡迎朋友來訪');
  } else if (user.q10_visitors <= 2) {
    preferences.push('希望安靜的居住環境');
  }

  // Pets (avoid if already in tag)
  if (!highlightFeature.includes('寵物') && !highlightFeature.includes('動物')) {
    if (user.q11_pets >= 4) {
      preferences.push('喜歡動物，希望室友也能接受寵物');
    } else if (user.q11_pets <= 2) {
      preferences.push('不太能接受養寵物');
    }
  }

  // Interaction
  if (user.q13_interaction >= 4) {
    preferences.push('喜歡與室友互動交流');
  } else if (user.q13_interaction <= 2) {
    preferences.push('偏好保持適當距離');
  }

  // Add bio highlights if available
  if (user.bio && user.bio.length > 10 && preferences.length < 4) {
    const bioSnippet = user.bio.substring(0, 30) + (user.bio.length > 30 ? '...' : '');
    preferences.push(bioSnippet);
  }

  return preferences.slice(0, 5);
};

/**
 * Generate "suitable for" description
 */
const generateSuitableFor = (user: User): BrowseUserCard['suitableFor'] => {
  const criteria: string[] = [];

  // Gender preference
  if (user.roommate_gender_preference === 'ANY') {
    criteria.push('性別不拘');
  } else if (user.roommate_gender_preference === 'GIF_ONLY') {
    criteria.push('性別認同為女性');
  } else if (user.roommate_gender_preference === 'GIM_ONLY') {
    criteria.push('性別認同為男性');
  } else if (user.roommate_gender_preference === 'SAF_ONLY') {
    criteria.push('生理女性');
  } else if (user.roommate_gender_preference === 'SAM_ONLY') {
    criteria.push('生理男性');
  }

  // Pets
  if (user.q11_pets >= 4) {
    criteria.push('能接受寵物');
  } else if (user.q11_pets <= 2) {
    criteria.push('不養寵物');
  }

  // Cleaning
  if (user.q9_cleaning >= 4) {
    criteria.push('重視清潔');
  }

  // Interaction
  if (user.q13_interaction >= 4) {
    criteria.push('喜歡互動交流');
  } else if (user.q13_interaction <= 2) {
    criteria.push('重視個人空間');
  }

  const description = criteria.join('、') + '的人';

  // Location summary
  const location = user.location_preferences.length > 2
    ? user.location_preferences[0].replace('台北市', '').replace('新北市', '') + '等區域'
    : user.location_preferences.map(loc => loc.replace('台北市', '').replace('新北市', '')).join('、');

  // Budget range
  const budgetRange = getBudgetDisplay(user.rent_budget_range);

  return {
    description,
    location,
    budgetRange,
  };
};

/**
 * Get pronoun based on gender
 */
const getPronoun = (user: User): '他' | '她' | 'TA' => {
  if (user.gender_identity === 'F') return '她';
  if (user.gender_identity === 'M') return '他';
  return 'TA';
};

/**
 * Calculate detailed score breakdown
 */
const calculateScoreBreakdown = (user1: User, user2: User): ScoreBreakdown => {
  let genderPreference = 0;
  let location = 0;
  let budget = 0;
  let lifestyle = 0;

  // Gender (40 points)
  const genderMatch =
    user1.roommate_gender_preference === 'ANY' ||
    (user1.roommate_gender_preference === 'GIF_ONLY' && user2.gender_identity === 'F') ||
    (user1.roommate_gender_preference === 'GIM_ONLY' && user2.gender_identity === 'M') ||
    (user1.roommate_gender_preference === 'SAF_ONLY' && user2.sex_assigned_at_birth === 'SAF') ||
    (user1.roommate_gender_preference === 'SAM_ONLY' && user2.sex_assigned_at_birth === 'SAM');

  const reverseGenderMatch =
    user2.roommate_gender_preference === 'ANY' ||
    (user2.roommate_gender_preference === 'GIF_ONLY' && user1.gender_identity === 'F') ||
    (user2.roommate_gender_preference === 'GIM_ONLY' && user1.gender_identity === 'M') ||
    (user2.roommate_gender_preference === 'SAF_ONLY' && user1.sex_assigned_at_birth === 'SAF') ||
    (user2.roommate_gender_preference === 'SAM_ONLY' && user1.sex_assigned_at_birth === 'SAM');

  if (genderMatch && reverseGenderMatch) {
    genderPreference = 40;
  }

  // Location (20 points)
  const locationMatch = user1.location_preferences.some(loc1 =>
    user2.location_preferences.some(loc2 => loc1.includes(loc2) || loc2.includes(loc1))
  );
  if (locationMatch) {
    location = 20;
  }

  // Budget (15 points)
  if (user1.rent_budget_range === user2.rent_budget_range) {
    budget = 15;
  } else {
    const budgetNum = (str: string) => parseInt(str.match(/\d+/)?.[0] || '0');
    const budgetDiff = Math.abs(budgetNum(user1.rent_budget_range) - budgetNum(user2.rent_budget_range));
    if (budgetDiff <= 2000) budget = 10;
    else if (budgetDiff <= 4000) budget = 5;
  }

  // Lifestyle (25 points)
  const habitQuestions = ['q9_cleaning', 'q10_visitors', 'q11_pets', 'q12_schedule', 'q13_interaction'];
  let habitScore = 0;
  habitQuestions.forEach(q => {
    // @ts-expect-error - accessing dynamic property
    const diff = Math.abs((user1[q] || 3) - (user2[q] || 3));
    habitScore += Math.max(0, 5 - diff);
  });
  lifestyle = Math.round((habitScore / (5 * habitQuestions.length)) * 25);

  return {
    genderPreference,
    location,
    budget,
    lifestyle,
  };
};

/**
 * Generate "why recommended" reasons
 */
const generateWhyRecommended = (
  user1: User,
  user2: User,
  breakdown: ScoreBreakdown
): string[] => {
  const reasons: string[] = [];

  // Gender preference
  if (breakdown.genderPreference === 40) {
    if (user1.roommate_gender_preference === 'ANY' && user2.roommate_gender_preference === 'ANY') {
      reasons.push('你們都接受任何性別的室友，相處彈性高');
    } else {
      reasons.push('性別偏好完全匹配');
    }
  }

  // Location
  if (breakdown.location === 20) {
    const overlap = user1.location_preferences.filter(loc =>
      user2.location_preferences.some(loc2 => loc.includes(loc2) || loc2.includes(loc))
    );
    if (overlap.length >= 2) {
      reasons.push(`地點偏好高度重疊（${overlap.map(l => l.replace('台北市', '').replace('新北市', '')).join('、')}）`);
    } else if (overlap.length === 1) {
      reasons.push(`都想住在${overlap[0].replace('台北市', '').replace('新北市', '')}`);
    }
  }

  // Budget
  if (breakdown.budget === 15) {
    reasons.push(`預算範圍完全一致（${getBudgetDisplay(user1.rent_budget_range)}）`);
  } else if (breakdown.budget >= 10) {
    reasons.push('預算範圍相近');
  }

  // Lifestyle habits
  if (user1.q9_cleaning === user2.q9_cleaning && user1.q9_cleaning >= 4) {
    reasons.push('都習慣看到髒就立刻掃，能維護乾淨環境');
  }
  if (user1.q11_pets === user2.q11_pets) {
    if (user1.q11_pets >= 4) {
      reasons.push('都喜歡寵物，可以一起分享養寵經驗');
    } else if (user1.q11_pets <= 2) {
      reasons.push('對寵物的態度一致');
    }
  }
  if (user1.q13_interaction === user2.q13_interaction) {
    if (user1.q13_interaction >= 4) {
      reasons.push('互動方式相近，都喜歡與室友交流');
    } else if (user1.q13_interaction <= 2) {
      reasons.push('互動方式相近，都重視個人空間');
    }
  }

  return reasons.slice(0, 5);
};

/**
 * Extract lifestyle habits in readable format
 */
const extractLifestyle = (user: User): MatchRecommendation['lifestyle'] => {
  const scheduleMap: Record<number, string> = {
    1: '極度晚睡晚起',
    2: '偏晚睡晚起',
    3: '正常作息',
    4: '偏早睡早起',
    5: '極度早睡早起',
  };

  const cleaningMap: Record<number, string> = {
    1: '很隨性，沒有固定掃地時間',
    2: '髒了再掃',
    3: '沒固定習慣，但願意配合共識',
    4: '看到髒就立刻掃',
    5: '每天固定打掃',
  };

  const petsMap: Record<number, string> = {
    1: '完全不能接受',
    2: '不太能接受',
    3: 'OK，只要有清潔規範',
    4: '喜歡寵物',
    5: '超愛動物，完全沒問題',
  };

  const interactionMap: Record<number, string> = {
    1: '完全不互動',
    2: '有基本禮貌，打招呼就好',
    3: '偶爾會聊天',
    4: '偶爾會聊天，適度互動',
    5: '很喜歡與室友互動交流',
  };

  return {
    schedule: scheduleMap[user.q12_schedule] || '正常作息',
    cleaning: cleaningMap[user.q9_cleaning] || '沒固定習慣',
    pets: petsMap[user.q11_pets] || 'OK',
    interaction: interactionMap[user.q13_interaction] || '偶爾會聊天',
  };
};

/**
 * Extract quote from bio
 */
const extractQuote = (bio: string): string | undefined => {
  if (!bio || bio.length < 10) return undefined;

  const sentences = bio.split(/[。！？\n]/);
  const keywordSentence = sentences.find(s =>
    s.includes('期待') || s.includes('希望') || s.includes('理想')
  );

  if (keywordSentence && keywordSentence.length < 100) {
    return keywordSentence.trim();
  }

  return bio.substring(0, 80) + (bio.length > 80 ? '...' : '');
};
