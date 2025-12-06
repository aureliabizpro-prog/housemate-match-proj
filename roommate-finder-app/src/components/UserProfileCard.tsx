import React from 'react';
import { User, MatchedUser } from '@/types/user';
import { MapPin, DollarSign, Heart, Mail, MessageSquare, User as UserIcon } from 'lucide-react';
import { obfuscateEmail } from '@/utils/matching';

interface UserProfileCardProps {
  user: User | MatchedUser;
  isMatchedUser?: boolean; // To show match score if applicable
}

// Helper to generate simple system recommendation
const generateSystemRecommendation = (user: User): string => {
  return '期待找到合拍的室友，一起創造舒適的居住環境 🏡';
};

const getBudgetDisplay = (budget: User['rent_budget_range']) => {
  const map = {
    'SHARE_LT8K': '$8,000以下',
    'SHARE_8K_10K': '$8,000-$10,000',
    'SHARE_10K_12K': '$10,001-$12,000',
    'SHARE_12K_15K': '$12,001-$15,000',
    'SHARE_15K_18K': '$15,001-$18,000',
    'SHARE_18K_22K': '$18,001-$22,000',
    'SHARE_GT22K': '$22,000以上'
  };
  return map[budget] || budget;
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isMatchedUser }) => {
  const displayEmail = obfuscateEmail(user.email);
  const systemRecommendation = generateSystemRecommendation(user);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-gray-800 flex items-center">
          <UserIcon size={18} className="mr-2 text-orange-500" />
          {displayEmail}
        </h3>
        {isMatchedUser && 'matchScore' in user && (
          <div className="flex items-center text-green-600 font-bold text-xl">
            <Heart size={20} className="mr-1" />
            {user.matchScore}%
          </div>
        )}
      </div>

      {/* System Recommendation */}
      <div className="bg-orange-50 rounded-lg p-2.5 mb-3">
        <p className="text-orange-800 text-xs leading-relaxed">💡 {systemRecommendation}</p>
      </div>

      {/* User Bio */}
      {user.bio && (
        <div className="mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">✍️ {user.bio}</p>
        </div>
      )}

      {/* Location and Budget */}
      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-orange-500" />
          <span>{user.location_preferences.join('、')}</span>
        </div>
        <div className="flex items-center">
          <DollarSign size={16} className="mr-2 text-green-500" />
          <span>{getBudgetDisplay(user.rent_budget_range)}</span>
        </div>
      </div>

    </div>
  );
};

export default UserProfileCard;
