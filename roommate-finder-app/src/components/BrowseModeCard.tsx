import React from 'react';
import { BrowseUserCard } from '@/types/user';
import { MapPin, DollarSign, Users, TrendingUp } from 'lucide-react';

interface BrowseModeCardProps {
  user: BrowseUserCard;
}

const BrowseModeCard: React.FC<BrowseModeCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Comprehensive Tag */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
          <span className="text-lg">{user.tagInfo.highlightEmoji || '👤'}</span>
          <span className="font-bold text-orange-800 break-keep">
            {user.tagInfo.gender} · {user.tagInfo.highlightFeature}
          </span>
        </div>
      </div>

      {/* Match Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          <div>
            <div className="text-xs text-gray-500 break-keep">平均契合度</div>
            <div className="text-xl font-bold text-green-600">{user.matchStats.averageMatchScore}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={20} className="text-orange-500" />
          <div>
            <div className="text-xs text-gray-500 break-keep">潛在室友</div>
            <div className="text-xl font-bold text-orange-600">{user.matchStats.potentialMatchCount} 位</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-700 mb-2 break-keep">{user.pronoun}在意的事：</h4>
        <ul className="space-y-1.5">
          {user.preferences.map((pref, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span className="break-keep">{pref}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suitable For */}
      <div className="mb-4 bg-green-50 rounded-lg p-3">
        <h4 className="text-sm font-bold text-green-800 mb-2 break-keep">適合什麼樣的人：</h4>
        <p className="text-sm text-green-700 mb-3 break-keep">{user.suitableFor.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-orange-500" />
            <span className="break-keep">{user.suitableFor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-green-500" />
            <span className="break-keep">{user.suitableFor.budgetRange}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-gradient-to-r from-orange-400 to-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-500 hover:to-green-600 transition-all flex items-center justify-center gap-2">
        <span>💭</span>
        <span className="break-keep">我覺得我可能適合欸</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default BrowseModeCard;
