import React from 'react';
import { MatchRecommendation } from '@/types/user';
import { Heart, Mail, Clock, Home, Users, Sparkles } from 'lucide-react';

interface MatchModeCardProps {
  match: MatchRecommendation;
  rank?: number; // Optional rank display (1-5)
}

const MatchModeCard: React.FC<MatchModeCardProps> = ({ match, rank }) => {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow break-keep">
      {/* Header with Rank and Score */}
      <div className="flex justify-between items-start mb-4 break-keep">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="bg-orange-300 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <span style={{ whiteSpace: 'nowrap' }}>#{rank}</span>
            </div>
          )}
          <div className="break-keep">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <span className="font-semibold text-gray-700 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{match.matchedUser.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock size={12} className="flex-shrink-0" />
              <span className="break-keep" style={{ whiteSpace: 'nowrap' }}>{formatDate(match.matchDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 flex-shrink-0">
          <Heart size={20} className="text-green-500" fill="currentColor" />
          <span className="font-bold text-green-600 text-xl" style={{ whiteSpace: 'nowrap' }}>{match.matchScore}%</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100 break-keep">
        <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase" style={{ whiteSpace: 'nowrap' }}>配對分數細項</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between break-keep">
            <span className="text-sm text-gray-600" style={{ whiteSpace: 'nowrap' }}>性別偏好</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-300"
                  style={{ width: `${(match.scoreBreakdown.genderPreference / 40) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right" style={{ whiteSpace: 'nowrap' }}>
                {match.scoreBreakdown.genderPreference}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between break-keep">
            <span className="text-sm text-gray-600" style={{ whiteSpace: 'nowrap' }}>地點重疊</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-200"
                  style={{ width: `${(match.scoreBreakdown.location / 20) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right" style={{ whiteSpace: 'nowrap' }}>
                {match.scoreBreakdown.location}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between break-keep">
            <span className="text-sm text-gray-600" style={{ whiteSpace: 'nowrap' }}>預算匹配</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-300"
                  style={{ width: `${(match.scoreBreakdown.budget / 15) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right" style={{ whiteSpace: 'nowrap' }}>
                {match.scoreBreakdown.budget}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between break-keep">
            <span className="text-sm text-gray-600" style={{ whiteSpace: 'nowrap' }}>生活習慣</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400"
                  style={{ width: `${(match.scoreBreakdown.lifestyle / 25) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right" style={{ whiteSpace: 'nowrap' }}>
                {match.scoreBreakdown.lifestyle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Recommended */}
      <div className="mb-4 break-keep">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-orange-400 flex-shrink-0" />
          <h4 className="text-sm font-bold text-gray-700" style={{ whiteSpace: 'nowrap' }}>為什麼推薦你們：</h4>
        </div>
        <ul className="space-y-2">
          {match.whyRecommended.map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start bg-orange-50 rounded-lg p-2 border border-orange-100 break-keep">
              <span className="text-orange-400 mr-2 font-bold flex-shrink-0">✓</span>
              <span className="break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lifestyle */}
      <div className="mb-4 border-t border-gray-100 pt-4 break-keep">
        <div className="flex items-center gap-2 mb-3">
          <Home size={18} className="text-orange-400 flex-shrink-0" />
          <h4 className="text-sm font-bold text-gray-700" style={{ whiteSpace: 'nowrap' }}>室友的生活習慣：</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-orange-50 rounded-lg p-2 border border-orange-100 break-keep">
            <span className="text-gray-500" style={{ whiteSpace: 'nowrap' }}>作息：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{match.lifestyle.schedule}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-2 border border-green-100 break-keep">
            <span className="text-gray-500" style={{ whiteSpace: 'nowrap' }}>清潔：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{match.lifestyle.cleaning}</span>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 border border-orange-100 break-keep">
            <span className="text-gray-500" style={{ whiteSpace: 'nowrap' }}>寵物：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{match.lifestyle.pets}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-2 border border-green-100 break-keep">
            <span className="text-gray-500" style={{ whiteSpace: 'nowrap' }}>互動：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{match.lifestyle.interaction}</span>
          </div>
        </div>
      </div>

      {/* Quote (if exists) */}
      {match.quote && (
        <div className="mb-4 bg-orange-50 rounded-lg p-4 border-l-4 border-orange-300 break-keep">
          <div className="flex items-start gap-2">
            <Users size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="break-keep">
              <div className="text-xs text-gray-500 mb-1" style={{ whiteSpace: 'nowrap' }}>室友說：</div>
              <p className="text-sm text-gray-700 italic break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>「{match.quote}」</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <button className="w-full bg-green-300 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2 break-keep">
        <Mail size={18} className="flex-shrink-0" />
        <span style={{ whiteSpace: 'nowrap' }}>聯絡這位室友</span>
      </button>
    </div>
  );
};

export default MatchModeCard;
