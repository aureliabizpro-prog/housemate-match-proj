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
    <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Header with Rank and Score */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="bg-gradient-to-br from-orange-400 to-green-500 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center">
              #{rank}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <span className="font-semibold text-gray-700 break-keep">{match.matchedUser.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock size={12} />
              <span className="break-keep">{formatDate(match.matchDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 rounded-full">
          <Heart size={20} className="text-green-600" fill="currentColor" />
          <span className="font-bold text-green-700 text-xl">{match.matchScore}%</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase break-keep">配對分數細項</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 break-keep">性別偏好</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                  style={{ width: `${(match.scoreBreakdown.genderPreference / 40) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.genderPreference}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 break-keep">地點重疊</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-500"
                  style={{ width: `${(match.scoreBreakdown.location / 20) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.location}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 break-keep">預算匹配</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500"
                  style={{ width: `${(match.scoreBreakdown.budget / 15) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.budget}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 break-keep">生活習慣</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  style={{ width: `${(match.scoreBreakdown.lifestyle / 25) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.lifestyle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Recommended */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-orange-500" />
          <h4 className="text-sm font-bold text-gray-700 break-keep">為什麼推薦你們：</h4>
        </div>
        <ul className="space-y-2">
          {match.whyRecommended.map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start bg-orange-50 rounded-lg p-2">
              <span className="text-orange-500 mr-2 font-bold">✓</span>
              <span className="break-keep">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lifestyle */}
      <div className="mb-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Home size={18} className="text-orange-500" />
          <h4 className="text-sm font-bold text-gray-700 break-keep">室友的生活習慣：</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-orange-50 rounded-lg p-2">
            <span className="text-gray-500 break-keep">作息：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep">{match.lifestyle.schedule}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <span className="text-gray-500 break-keep">清潔：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep">{match.lifestyle.cleaning}</span>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <span className="text-gray-500 break-keep">寵物：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep">{match.lifestyle.pets}</span>
          </div>
          <div className="bg-orange-50 rounded-lg p-2">
            <span className="text-gray-500 break-keep">互動：</span>
            <span className="text-gray-700 font-medium ml-1 break-keep">{match.lifestyle.interaction}</span>
          </div>
        </div>
      </div>

      {/* Quote (if exists) */}
      {match.quote && (
        <div className="mb-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg p-4 border-l-4 border-orange-400">
          <div className="flex items-start gap-2">
            <Users size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 mb-1 break-keep">室友說：</div>
              <p className="text-sm text-gray-700 italic break-keep">「{match.quote}」</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <button className="w-full bg-gradient-to-r from-orange-400 to-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-500 hover:to-green-600 transition-all flex items-center justify-center gap-2">
        <Mail size={18} />
        <span className="break-keep">聯絡這位室友</span>
      </button>
    </div>
  );
};

export default MatchModeCard;
