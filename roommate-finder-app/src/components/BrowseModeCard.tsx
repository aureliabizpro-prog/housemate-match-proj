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
        <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-200">
          <span className="text-lg">{user.tagInfo.highlightEmoji || '👤'}</span>
          <span className="font-bold text-orange-700" style={{ whiteSpace: 'nowrap' }}>
            {user.tagInfo.gender} · {user.tagInfo.highlightFeature}
          </span>
        </div>
      </div>

      {/* Match Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 break-keep">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-green-600 flex-shrink-0" />
          <div className="break-keep">
            <div className="text-xs text-gray-500" style={{ whiteSpace: 'nowrap' }}>平均契合度</div>
            <div className="text-xl font-bold text-green-600">{user.matchStats.averageMatchScore}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={20} className="text-orange-600 flex-shrink-0" />
          <div className="break-keep">
            <div className="text-xs text-gray-500" style={{ whiteSpace: 'nowrap' }}>潛在室友</div>
            <div className="text-xl font-bold text-orange-600">{user.matchStats.potentialMatchCount} <span style={{ whiteSpace: 'nowrap' }}>位</span></div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4 break-keep">
        <h4 className="text-sm font-bold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>{user.pronoun}在意的事：</h4>
        <ul className="space-y-1.5">
          {user.preferences.map((pref, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start break-keep">
              <span className="text-orange-600 mr-2 flex-shrink-0">•</span>
              <span className="break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{pref}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suitable For */}
      <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100 break-keep">
        <h4 className="text-sm font-bold text-green-700 mb-2" style={{ whiteSpace: 'nowrap' }}>適合什麼樣的人：</h4>
        <p className="text-sm text-green-700 mb-3 break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{user.suitableFor.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 break-keep">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-orange-600 flex-shrink-0" />
            <span className="break-keep" style={{ whiteSpace: 'nowrap' }}>{user.suitableFor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-green-600 flex-shrink-0" />
            <span className="break-keep" style={{ whiteSpace: 'nowrap' }}>{user.suitableFor.budgetRange}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 break-keep">
        <span>💭</span>
        <span style={{ whiteSpace: 'nowrap' }}>我覺得我可能適合欸</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default BrowseModeCard;
