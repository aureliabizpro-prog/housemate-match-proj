import React, { useState, useMemo } from 'react';
import { Users, Heart, MapPin, DollarSign, TrendingUp, Search } from 'lucide-react';

const RoommateMatchingSystem = () => {
  const [viewMode, setViewMode] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [minScore, setMinScore] = useState(60);

  const processedUsers = useMemo(() => {
    return [
      {
        id: 'han911522',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'ANY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['松山區', '中山區'],
        q9_cleaning: 1,
        q10_visitors: 5,
        q11_pets: 5,
        q12_schedule: 3,
        q13_interaction: 3,
        bio: '從事影視業，有養馬爾濟斯'
      },
      {
        id: 'willy233',
        sex_assigned_at_birth: 'SAM',
        gender_identity: 'NB',
        roommate_gender_preference: 'ANY',
        rent_budget_range: 'SHARE_8K_10K',
        location_preferences: ['文山區'],
        q9_cleaning: 1,
        q10_visitors: 2,
        q11_pets: 5,
        q12_schedule: 3,
        q13_interaction: 3,
        bio: '現有空間找新室友'
      },
      {
        id: 'ruby61428',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'GIF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['中正區', '萬華區', '板橋區'],
        q9_cleaning: 3,
        q10_visitors: 2,
        q11_pets: 3,
        q12_schedule: 3,
        q13_interaction: 2,
        bio: '台北行銷工作'
      },
      {
        id: 'chiyau0829',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'SAF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['龍山寺', '後山埤', '信義安和'],
        q9_cleaning: 5,
        q10_visitors: 2,
        q11_pets: 5,
        q12_schedule: 4,
        q13_interaction: 2,
        bio: ''
      },
      {
        id: 'viviloveexce',
        sex_assigned_at_birth: 'SAM',
        gender_identity: 'M',
        roommate_gender_preference: 'GIF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['三重', '中山', '社子'],
        q9_cleaning: 3,
        q10_visitors: 3,
        q11_pets: 3,
        q12_schedule: 3,
        q13_interaction: 3,
        bio: '34歲男性，有兩隻貓'
      },
      {
        id: 'yuchun1020243',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'SAF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['南港', '汐止', '松山'],
        q9_cleaning: 3,
        q10_visitors: 2,
        q11_pets: 3,
        q12_schedule: 3,
        q13_interaction: 3,
        bio: '科技業工程師'
      },
      {
        id: 'pomelo4187',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'GIF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['台北捷運沿線'],
        q9_cleaning: 2,
        q10_visitors: 2,
        q11_pets: 5,
        q12_schedule: 4,
        q13_interaction: 3,
        bio: '有養2隻貓，愛烹飪'
      },
      {
        id: 'forever93176',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'SAF_ONLY',
        rent_budget_range: 'SHARE_8K_10K',
        location_preferences: ['南港', '松山'],
        q9_cleaning: 1,
        q10_visitors: 3,
        q11_pets: 3,
        q12_schedule: 3,
        q13_interaction: 3,
        bio: '希望可以一起煮飯'
      },
      {
        id: 'wnvivian0104',
        sex_assigned_at_birth: 'SAF',
        gender_identity: 'F',
        roommate_gender_preference: 'SAF_ONLY',
        rent_budget_range: 'SHARE_10K_12K',
        location_preferences: ['大安區', '中正區'],
        q9_cleaning: 2,
        q10_visitors: 3,
        q11_pets: 1,
        q12_schedule: 2,
        q13_interaction: 3,
        bio: ''
      }
    ];
  }, []);

  const calculateMatchScore = (user1, user2) => {
    let score = 0;

    const user1Matches = 
      user1.roommate_gender_preference === 'ANY' || 
      (user1.roommate_gender_preference === 'GIF_ONLY' && user2.gender_identity === 'F') ||
      (user1.roommate_gender_preference === 'GIM_ONLY' && user2.gender_identity === 'M') ||
      (user1.roommate_gender_preference === 'SAF_ONLY' && user2.sex_assigned_at_birth === 'SAF') ||
      (user1.roommate_gender_preference === 'SAM_ONLY' && user2.sex_assigned_at_birth === 'SAM');

    const user2Matches = 
      user2.roommate_gender_preference === 'ANY' || 
      (user2.roommate_gender_preference === 'GIF_ONLY' && user1.gender_identity === 'F') ||
      (user2.roommate_gender_preference === 'GIM_ONLY' && user1.gender_identity === 'M') ||
      (user2.roommate_gender_preference === 'SAF_ONLY' && user1.sex_assigned_at_birth === 'SAF') ||
      (user2.roommate_gender_preference === 'SAM_ONLY' && user1.sex_assigned_at_birth === 'SAM');

    if (!user1Matches || !user2Matches) return 0;
    score += 40;

    const locationMatch = user1.location_preferences.some(loc1 => 
      user2.location_preferences.some(loc2 => 
        loc1.includes(loc2) || loc2.includes(loc1)
      )
    );
    if (locationMatch) score += 20;

    if (user1.rent_budget_range === user2.rent_budget_range) {
      score += 15;
    }

    const habits = ['q9_cleaning', 'q10_visitors', 'q11_pets', 'q12_schedule', 'q13_interaction'];
    let habitScore = 0;
    habits.forEach(q => {
      const diff = Math.abs((user1[q] || 3) - (user2[q] || 3));
      habitScore += Math.max(0, 5 - diff);
    });
    score += (habitScore / 25) * 25;

    return Math.round(score);
  };

  const allMatches = useMemo(() => {
    const matches = [];
    for (let i = 0; i < processedUsers.length; i++) {
      for (let j = i + 1; j < processedUsers.length; j++) {
        const score = calculateMatchScore(processedUsers[i], processedUsers[j]);
        if (score >= minScore) {
          matches.push({
            user1: processedUsers[i],
            user2: processedUsers[j],
            score: score
          });
        }
      }
    }
    return matches.sort((a, b) => b.score - a.score);
  }, [processedUsers, minScore]);

  const findMatches = (userId) => {
    const user = processedUsers.find(u => u.id === userId);
    if (!user) return [];

    return processedUsers
      .filter(u => u.id !== userId)
      .map(candidate => ({
        ...candidate,
        matchScore: calculateMatchScore(user, candidate)
      }))
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  const selectedMatches = selectedUser ? findMatches(selectedUser) : [];

  const getGenderDisplay = (user) => {
    if (user.gender_identity === 'NB') return '非二元';
    if (user.gender_identity === 'F') return '女';
    if (user.gender_identity === 'M') return '男';
    return '未指定';
  };

  const getPrefDisplay = (pref) => {
    const map = {
      'ANY': '不拘',
      'GIF_ONLY': '性別認同女',
      'SAF_ONLY': '生理女'
    };
    return map[pref] || pref;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Heart className="text-pink-500" size={40} />
            室友配對分析系統
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm text-gray-600">有效填答：</span>
              <span className="text-2xl font-bold text-purple-600 ml-2">{processedUsers.length}</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-sm">
              <span className="text-sm text-gray-600">高分配對：</span>
              <span className="text-2xl font-bold text-pink-600 ml-2">{allMatches.length}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <TrendingUp className="inline mr-2" size={20} />
            查看所有配對
          </button>
          <button
            onClick={() => setViewMode('individual')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'individual' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            <Search className="inline mr-2" size={20} />
            個別查詢
          </button>
        </div>

        {viewMode === 'all' && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 max-w-md mx-auto">
            <label className="text-sm text-gray-600 mb-2 block">最低分數：{minScore}%</label>
            <input
              type="range"
              min="50"
              max="90"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {viewMode === 'all' ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              高分配對列表
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {allMatches.map((match, index) => (
                <div key={index} className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="text-2xl font-bold text-purple-600">
                      {match.score}%
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-bold text-purple-700 mb-2">{match.user1.id}</div>
                      <div className="text-sm text-gray-600">
                        {getGenderDisplay(match.user1)} · 找{getPrefDisplay(match.user1.roommate_gender_preference)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                        <MapPin size={12} />
                        {match.user1.location_preferences.slice(0, 2).join('、')}
                      </div>
                      {match.user1.bio && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          {match.user1.bio}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="font-bold text-pink-700 mb-2">{match.user2.id}</div>
                      <div className="text-sm text-gray-600">
                        {getGenderDisplay(match.user2)} · 找{getPrefDisplay(match.user2.roommate_gender_preference)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                        <MapPin size={12} />
                        {match.user2.location_preferences.slice(0, 2).join('、')}
                      </div>
                      {match.user2.bio && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          {match.user2.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">選擇用戶</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {processedUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedUser === user.id ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{user.id}</div>
                    <div className="text-sm text-gray-600">
                      {getGenderDisplay(user)} · 找{getPrefDisplay(user.roommate_gender_preference)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">配對推薦</h2>
              {!selectedUser ? (
                <div className="text-center py-20 text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>請選擇用戶</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedMatches.map((match, index) => (
                    <div key={match.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold">{match.id}</div>
                        <div className="text-lg font-bold text-purple-600">{match.matchScore}%</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {getGenderDisplay(match)} · 找{getPrefDisplay(match.roommate_gender_preference)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin size={12} />
                        {match.location_preferences.join('、')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoommateMatchingSystem;