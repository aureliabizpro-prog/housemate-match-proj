import React from 'react';
import { BrowseUserCard } from '@/types/user';
import { MapPin, DollarSign, Users, TrendingUp } from 'lucide-react';

interface BrowseModeCardProps {
  user: BrowseUserCard;
}

const BrowseModeCard: React.FC<BrowseModeCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow break-keep">
      {/* Comprehensive Tag */}
      <div className="mb-4 break-keep">
        <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 flex-wrap">
          <span className="text-lg flex-shrink-0">{user.tagInfo.highlightEmoji || '👤'}</span>
          <span className="font-bold text-orange-500" style={{ wordBreak: 'keep-all' }}>
            {user.tagInfo.gender}&nbsp;·&nbsp;{user.tagInfo.highlightFeature}
          </span>
        </div>
      </div>

      {/* Match Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 flex-wrap">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-green-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500" style={{ wordBreak: 'keep-all' }}>平均契合度</div>
            <div className="text-xl font-bold text-green-500">{user.matchStats.averageMatchScore}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={20} className="text-orange-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-500" style={{ wordBreak: 'keep-all' }}>潛在室友</div>
            <div className="text-xl font-bold text-orange-500">{user.matchStats.potentialMatchCount}&nbsp;位</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-700 mb-2" style={{ wordBreak: 'keep-all' }}>{user.pronoun}在意的事：</h4>
        <ul className="space-y-1.5">
          {user.preferences.map((pref, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-orange-600 mr-2 flex-shrink-0">•</span>
              <span style={{ wordBreak: 'keep-all' }}>{pref}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suitable For */}
      <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
        <h4 className="text-sm font-bold text-green-500 mb-2" style={{ wordBreak: 'keep-all' }}>適合什麼樣的人：</h4>
        <p className="text-sm text-green-600 mb-3" style={{ wordBreak: 'keep-all' }}>{user.suitableFor.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-orange-400 flex-shrink-0" />
            <span style={{ wordBreak: 'keep-all' }}>{user.suitableFor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-green-400 flex-shrink-0" />
            <span style={{ wordBreak: 'keep-all' }}>{user.suitableFor.budgetRange}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-orange-300 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-400 transition-all flex items-center justify-center gap-2">
        <span className="flex-shrink-0">💭</span>
        <span style={{ wordBreak: 'keep-all' }}>我覺得我可能適合欸</span>
        <span className="flex-shrink-0">→</span>
      </button>
    </div>
  );
};

export default BrowseModeCard;
