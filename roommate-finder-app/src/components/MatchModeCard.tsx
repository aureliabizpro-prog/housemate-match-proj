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
      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="bg-orange-300 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              #{rank}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <span className="font-semibold text-gray-700" style={{ wordBreak: 'break-all' }}>{match.matchedUser.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock size={12} className="flex-shrink-0" />
              <span style={{ wordBreak: 'keep-all' }}>{formatDate(match.matchDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 flex-shrink-0">
          <Heart size={20} className="text-green-500" fill="currentColor" />
          <span className="font-bold text-green-600 text-xl">{match.matchScore}%</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
        <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase" style={{ wordBreak: 'keep-all' }}>配對分數細項</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0" style={{ wordBreak: 'keep-all' }}>性別偏好</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-300"
                  style={{ width: `${(match.scoreBreakdown.genderPreference / 40) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.genderPreference}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0" style={{ wordBreak: 'keep-all' }}>地點重疊</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-200"
                  style={{ width: `${(match.scoreBreakdown.location / 20) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.location}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0" style={{ wordBreak: 'keep-all' }}>預算匹配</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-300"
                  style={{ width: `${(match.scoreBreakdown.budget / 15) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                {match.scoreBreakdown.budget}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0" style={{ wordBreak: 'keep-all' }}>生活習慣</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400"
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
          <Sparkles size={18} className="text-orange-400 flex-shrink-0" />
          <h4 className="text-sm font-bold text-gray-700" style={{ wordBreak: 'keep-all' }}>為什麼推薦你們：</h4>
        </div>
        <ul className="space-y-2">
          {match.whyRecommended.map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start bg-orange-50 rounded-lg p-2 border border-orange-100">
              <span className="text-orange-400 mr-2 font-bold flex-shrink-0">✓</span>
              <span style={{ wordBreak: 'keep-all' }}>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lifestyle */}
      <div className="mb-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Home size={18} className="text-orange-400 flex-shrink-0" />
          <h4 className="text-sm font-bold text-gray-700" style={{ wordBreak: 'keep-all' }}>室友的生活習慣：</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
            <div className="text-gray-500 mb-0.5" style={{ wordBreak: 'keep-all' }}>作息：</div>
            <div className="text-gray-700 font-medium" style={{ wordBreak: 'keep-all' }}>{match.lifestyle.schedule}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 border border-green-100">
            <div className="text-gray-500 mb-0.5" style={{ wordBreak: 'keep-all' }}>清潔：</div>
            <div className="text-gray-700 font-medium" style={{ wordBreak: 'keep-all' }}>{match.lifestyle.cleaning}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
            <div className="text-gray-500 mb-0.5" style={{ wordBreak: 'keep-all' }}>寵物：</div>
            <div className="text-gray-700 font-medium" style={{ wordBreak: 'keep-all' }}>{match.lifestyle.pets}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 border border-green-100">
            <div className="text-gray-500 mb-0.5" style={{ wordBreak: 'keep-all' }}>互動：</div>
            <div className="text-gray-700 font-medium" style={{ wordBreak: 'keep-all' }}>{match.lifestyle.interaction}</div>
          </div>
        </div>
      </div>

      {/* Quote (if exists) */}
      {match.quote && (
        <div className="mb-4 bg-orange-50 rounded-lg p-4 border-l-4 border-orange-300">
          <div className="flex items-start gap-2">
            <Users size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 mb-1" style={{ wordBreak: 'keep-all' }}>室友說：</div>
              <p className="text-sm text-gray-700 italic" style={{ wordBreak: 'keep-all' }}>「{match.quote}」</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <button className="w-full bg-green-300 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2">
        <Mail size={18} className="flex-shrink-0" />
        <span style={{ wordBreak: 'keep-all' }}>聯絡這位室友</span>
      </button>
    </div>
  );
};

export default MatchModeCard;
