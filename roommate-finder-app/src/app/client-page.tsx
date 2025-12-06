"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed to next/router
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { ChevronLeft, ChevronRight, Search, Users, Heart, MapPin, DollarSign, Home, Mail, MessageSquare, Info, CalendarDays } from 'lucide-react';
import { User, MatchedUser } from '@/types/user';
import UserProfileCard from '@/components/UserProfileCard';
import { obfuscateEmail } from '@/utils/matching';


export default function ClientPageContent() {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]); // Initialize with empty array
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[] | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [error, setError] = useState<string | null>(null); // For error handling
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false); // For friendly popup

  const slides = [
    {
      title: '🏠 好室友®',
      subtitle: '用配對，找到真正合拍的室友',
      desc: `已有 ${allUsers.length} 組成功配對 ✨`,
      showCTA: true
    },
    {
      title: '🏡 配對案例 #1 (大安區)',
      subtitle: '「軟體工程師 × 老師」',
      desc: '契合指數 94%\n\n✨ 都重視作息同步和空間整潔',
      showCTA: false
    },
    {
      title: '📊 我們的社群',
      subtitle: '✓ 13 組成功配對',
      desc: '✓ 涵蓋台北、台中、高雄\n✓ 平均契合指數 85%',
      showCTA: false
    }
  ];

  // Fetch all users from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setAllUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (!searchEmail) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/users?email=${encodeURIComponent(searchEmail)}`);
      if (!res.ok) {
        // Show friendly popup instead of error message
        setShowNotFoundPopup(true);
        setMatchedUsers(null);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      // The API returns { currentUser, top5Matches }
      setMatchedUsers(data.top5Matches);
    } catch (err) {
      setShowNotFoundPopup(true);
      setMatchedUsers(null);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (matchedUsers) return matchedUsers; // If showing matched users, don't filter further
    if (filterLocation === 'ALL') return allUsers;
    return allUsers.filter(user => user.location_preferences.includes(filterLocation));
  }, [allUsers, filterLocation, matchedUsers]);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    allUsers.forEach(user => { // Use allUsers state instead of initialUsersData
      user.location_preferences.forEach(loc => locations.add(loc));
    });
    return Array.from(locations);
  }, [allUsers]); // Dependency on allUsers

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Carousel with Background */}
        <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
          {/* Background Image */}
          <img
            src="/illustrations/undraw_city-life_l74x.svg"
            alt="城市生活"
            className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none"
          />

          {/* Carousel */}
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            selectedItem={currentSlide}
            onChange={setCurrentSlide}
            className="relative z-10"
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button type="button" onClick={onClickHandler} title={label} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full z-20 hover:bg-black/40 transition-all">
                  <ChevronLeft size={24} />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button type="button" onClick={onClickHandler} title={label} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full z-20 hover:bg-black/40 transition-all">
                  <ChevronRight size={24} />
                </button>
              )
            }
          >
            {slides.map((slide, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-100/70 to-green-100/70 backdrop-blur-md p-8 text-center min-h-64 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight drop-shadow-sm">{slide.title}</h2>
                <p className="text-base text-gray-700 mb-2 leading-relaxed drop-shadow-sm">{slide.subtitle}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line mb-5 leading-relaxed drop-shadow-sm">{slide.desc}</p>
                {slide.showCTA && (
                  <a
                    href="https://forms.gle/iuFj9gA97zhynTKm6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all shadow-md text-sm"
                  >
                    立即填寫配對問卷
                  </a>
                )}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3 text-center">已填寫問卷？輸入您的 email 查看專屬配對結果</p>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="your.email@example.com"
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-28 py-3 rounded-full border-2 border-gray-200 focus:border-orange-300 focus:outline-none text-base"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2.5 px-5 py-2 bg-orange-300 text-gray-800 rounded-full hover:bg-orange-400 transition-all font-medium"
            >
              查詢
            </button>
          </div>
        </div>

        {matchedUsers ? (
          matchedUsers.length > 0 ? (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 你的最佳配對推薦</h2>
              {matchedUsers.map(user => (
                <UserProfileCard key={user.id} user={user} isMatchedUser={true} />
              ))}
            </div>
          ) : null
        ) : (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">👥 配對案例參考</h2>
            {filteredUsers.slice(0, 5).map(user => (
              <UserProfileCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Why Choose Us */}
        <div className="mt-8 space-y-3">
          <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-2xl">🏡</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 mb-1">13 組真實配對成功</h4>
                <p className="text-xs text-gray-600">平均契合度 85%，不是隨機配對</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50/60 rounded-xl p-4 border border-green-100/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-2xl">🌈</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 mb-1">多元性別友善空間</h4>
                <p className="text-xs text-gray-600">尊重每個人的性別認同與偏好</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50/60 rounded-xl p-4 border border-yellow-100/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 mb-1">重視生活契合，非交友平台</h4>
                <p className="text-xs text-gray-600">從作息到清潔習慣，找到真正合拍的室友</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA for Survey */}
        <div className="mt-8 bg-orange-50 rounded-xl p-6 text-center shadow-sm border border-orange-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">已有 {allUsers.length} 人在找室友</h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">你也想找到理想的合租夥伴嗎？立即填寫問卷，讓系統為你推薦！</p>
          <a
            href="https://forms.gle/iuFj9gA97zhynTKm6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all shadow-sm text-sm"
          >
            立即填寫問卷
          </a>
        </div>
      </div>

      {/* Friendly Not Found Popup */}
      {showNotFoundPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowNotFoundPopup(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <img
                src="/illustrations/undraw_taken_mshk.svg"
                alt="尚未註冊"
                className="w-48 h-auto mx-auto mb-4"
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.querySelector('.fallback-emoji')?.classList.remove('hidden') }}
              />
              <div className="text-5xl mb-3 hidden fallback-emoji">🏡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">還沒有您的配對資料</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                我們的系統中還沒有您的資料。填寫問卷後，我們會為您尋找最合拍的室友！
              </p>
            </div>
            <div className="space-y-3">
              <a
                href="https://forms.gle/iuFj9gA97zhynTKm6"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-orange-400 text-white rounded-full font-semibold hover:bg-orange-500 transition-all text-center text-sm"
              >
                立即填寫配對問卷
              </a>
              <button
                onClick={() => setShowNotFoundPopup(false)}
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all text-sm"
              >
                稍後再說
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
