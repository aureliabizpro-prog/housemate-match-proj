"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeft, ChevronRight, Search, X, ArrowLeft, Eye } from 'lucide-react';
import { BrowseUserCard, MatchRecommendation } from '@/types/user';
import BrowseModeCard from '@/components/BrowseModeCard';
import MatchModeCard from '@/components/MatchModeCard';
import { usersData, calculateMatchScore, obfuscateEmail } from '@/utils/matching';
import { transformToBrowseUserCard, transformToMatchRecommendation } from '@/utils/mockApiTransformers';


export default function ClientPageContent() {
  const router = useRouter();

  // Demo email constant for trial experience
  const DEMO_EMAIL = 'user002@example.com';

  const [browseUsers, setBrowseUsers] = useState<BrowseUserCard[]>([]);
  const [matchRecommendations, setMatchRecommendations] = useState<MatchRecommendation[] | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);
  const [searchState, setSearchState] = useState<'initial' | 'notFound' | 'noMatches' | 'hasMatches'>('initial');
  const [visibleCards, setVisibleCards] = useState(3); // Pagination: start with 3 cards

  const slides = [
    {
      title: '🏠 好室友®',
      subtitle: '用配對，找到真正合拍的室友',
      desc: `已有 ${browseUsers.length} 人在找室友 ✨`,
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

  // Transform users to Browse Mode cards
  useEffect(() => {
    try {
      setIsLoading(true);
      const browseModeCards = usersData.map(user => transformToBrowseUserCard(user));
      setBrowseUsers(browseModeCards);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (emailToSearch?: string) => {
    const email = emailToSearch || searchEmail;
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);

      // Special test case for demonstrating noMatches state
      if (email.trim().toLowerCase() === 'test.nomatch@test.com') {
        console.log('[搜尋調試] 測試 email: test.nomatch@test.com');
        console.log('[搜尋調試] 強制返回 noMatches 狀態');
        setMatchRecommendations([]);
        setSearchState('noMatches');
        setIsLoading(false);
        return;
      }

      // Find user in original data
      const currentUser = usersData.find(u => u.email === email.trim());

      if (!currentUser) {
        setShowNotFoundPopup(true);
        setMatchRecommendations(null);
        setSearchState('notFound');
        setIsLoading(false);
        return;
      }

      // Calculate matches and transform to MatchRecommendation format
      const matches: MatchRecommendation[] = [];
      for (const candidate of usersData) {
        if (candidate.id === currentUser.id) continue;

        const matchScore = calculateMatchScore(currentUser, candidate);
        if (matchScore > 0) {
          const matchRecommendation = transformToMatchRecommendation(
            currentUser,
            candidate,
            obfuscateEmail(candidate.email)
          );
          matches.push(matchRecommendation);
        }
      }

      // Sort by match score and take top 5
      matches.sort((a, b) => b.matchScore - a.matchScore);
      const topMatches = matches.slice(0, 5);

      console.log(`[搜尋調試] Email: ${email.trim()}`);
      console.log(`[搜尋調試] 找到的配對數: ${matches.length}`);
      console.log(`[搜尋調試] Top 5 配對數: ${topMatches.length}`);

      setMatchRecommendations(topMatches);

      // Set search state based on results
      if (topMatches.length > 0) {
        console.log('[搜尋調試] 設置狀態: hasMatches');
        setSearchState('hasMatches');
      } else {
        console.log('[搜尋調試] 設置狀態: noMatches');
        setSearchState('noMatches');
      }
    } catch (err) {
      setShowNotFoundPopup(true);
      setMatchRecommendations(null);
      setSearchState('notFound');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchEmail('');
    setSearchState('initial');
    setMatchRecommendations(null);
    setShowNotFoundPopup(false);
    setVisibleCards(3); // Reset pagination to first page
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = () => {
    setSearchEmail(DEMO_EMAIL);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Delay search trigger to let scroll animation complete, and pass email directly
    setTimeout(() => {
      handleSearch(DEMO_EMAIL);
    }, 300);
  };

  const filteredBrowseUsers = useMemo(() => {
    if (filterLocation === 'ALL') return browseUsers;
    // Filter based on location in suitableFor
    return browseUsers.filter(user =>
      user.suitableFor.location.includes(filterLocation.replace('台北市', '').replace('新北市', ''))
    );
  }, [browseUsers, filterLocation]);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    browseUsers.forEach(user => {
      const loc = user.suitableFor.location;
      locations.add(loc);
    });
    return Array.from(locations);
  }, [browseUsers]);

  // Check if currently in Demo mode
  const isDemoMode = searchEmail === DEMO_EMAIL && searchState === 'hasMatches';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Carousel with Background */}
        <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
          {/* Background Image */}
          <img
            src="/housemate-match-proj/illustrations/undraw_city-life_l74x.svg"
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
                <h2 className="text-3xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight drop-shadow-sm break-keep">{slide.title}</h2>
                <p className="text-lg md:text-base text-gray-700 mb-3 leading-relaxed drop-shadow-sm break-keep">{slide.subtitle}</p>
                <p className="text-base md:text-sm text-gray-600 whitespace-pre-line mb-5 leading-relaxed drop-shadow-sm break-keep">{slide.desc}</p>
                {slide.showCTA && (
                  <a
                    href="https://forms.gle/iuFj9gA97zhynTKm6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all shadow-md text-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    開始配對
                  </a>
                )}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <p className="text-base md:text-sm text-gray-600 mb-3 text-center">已填寫資料？輸入 Email 查看配對結果</p>
          <div className="relative">
            <Search className="absolute left-4 top-4 md:top-3.5 text-gray-400" size={22} />
            <input
              type="email"
              placeholder="your.email@example.com"
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-28 py-4 md:py-3 rounded-full border-2 border-gray-200 focus:border-orange-300 focus:outline-none text-lg md:text-base"
            />
            {searchEmail && (
              <button
                onClick={handleReset}
                className="absolute right-24 top-4 md:top-3.5 text-gray-400 hover:text-gray-600 transition-all"
                title="清除搜尋"
              >
                <X size={20} />
              </button>
            )}
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-2.5 px-5 py-2 bg-orange-300 text-gray-800 rounded-full hover:bg-orange-400 transition-all font-medium text-base md:text-sm"
            >
              查詢
            </button>
          </div>

          {/* Debug Status Indicator */}
          {searchEmail && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-600">
                <span className="font-mono">當前狀態:</span>
                <span className={`font-bold ${
                  searchState === 'initial' ? 'text-gray-500' :
                  searchState === 'notFound' ? 'text-red-500' :
                  searchState === 'noMatches' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {searchState === 'initial' && '初始狀態'}
                  {searchState === 'notFound' && '未找到'}
                  {searchState === 'noMatches' && '無配對'}
                  {searchState === 'hasMatches' && `有配對 (${matchRecommendations?.length || 0})`}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* 返回瀏覽按鈕 - 在有搜尋結果時顯示 */}
        {(searchState === 'hasMatches' || searchState === 'noMatches') && (
          <div className="mb-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-green-100 text-gray-700 rounded-full hover:from-orange-200 hover:to-green-200 transition-all font-medium text-base md:text-sm border border-orange-200 shadow-sm mx-auto"
            >
              <ArrowLeft size={18} className="flex-shrink-0" />
              <span style={{ wordBreak: 'keep-all' }}>瀏覽所有室友</span>
            </button>
          </div>
        )}

        {/* 狀態3：已註冊有配對 - 顯示 Match Mode */}
        {searchState === 'hasMatches' && matchRecommendations && matchRecommendations.length > 0 && (
          <div>
            <h2 className="text-xl md:text-lg font-bold text-gray-800 mb-4">
              {isDemoMode ? '✨ 配對結果示範' : '🎯 你的最佳配對推薦'}
            </h2>
            {matchRecommendations.slice(0, isDemoMode ? 2 : 5).map((match, index) => (
              <MatchModeCard key={match.matchId} match={match} rank={index + 1} />
            ))}

            {/* Demo Mode CTA - 只在 Demo 模式顯示 */}
            {isDemoMode && (
              <div className="mt-6 bg-gradient-to-r from-orange-50 to-green-50 rounded-3xl p-6 md:p-8 text-center border-2 border-orange-200">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-2xl md:text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  你和好室友的距離，現在只差一步了！
                </h3>
                <a
                  href="https://forms.gle/iuFj9gA97zhynTKm6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 md:px-6 md:py-2.5 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all shadow-sm text-base md:text-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  1分鐘！勾勒你的室友理想型
                </a>
              </div>
            )}
          </div>
        )}

        {/* 狀態2：已註冊但無配對 - 顯示「媒合中」區塊 */}
        {searchState === 'noMatches' && (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-4 border border-gray-100 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-2xl md:text-xl font-bold text-gray-800 mb-5">配對進行中</h3>
            <p className="text-base md:text-sm text-gray-600 leading-relaxed">
              通常我們會在您填寫資料 1-3 天後 email 通知您，屆時請回到這個頁面查看詳細配對結果。
            </p>
          </div>
        )}

        {/* 狀態1 & 初始狀態：顯示 Browse Mode */}
        {(searchState === 'initial' || searchState === 'notFound') && (
          <div>
            <h2 className="text-xl md:text-lg font-bold text-gray-800 mb-4">👥 尋找室友中</h2>

            {/* Display visible cards with Demo button inserted after 3rd card */}
            {filteredBrowseUsers.slice(0, visibleCards).map((user, index) => (
              <div key={user.userId}>
                <BrowseModeCard user={user} />

                {/* Insert Demo button after 3rd card (index 2) only on first page and initial state */}
                {index === 2 && searchState === 'initial' && (
                  <div className="my-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 md:p-8 text-center border-2 border-green-200">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="text-xl md:text-lg font-bold text-gray-800 mb-5 leading-relaxed">
                      好想看看！配對結果會長怎樣？！
                    </h3>
                    <button
                      onClick={handleDemoClick}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all shadow-md text-base md:text-sm"
                    >
                      <Eye size={20} className="flex-shrink-0" />
                      <span style={{ wordBreak: 'keep-all' }}>讓你偷看一眼</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Load More Button */}
            {visibleCards < filteredBrowseUsers.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setVisibleCards(prev => prev + 3)}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-orange-100 to-green-100 text-gray-800 rounded-full font-semibold hover:from-orange-200 hover:to-green-200 transition-all shadow-sm border border-orange-200 text-base md:text-sm"
                >
                  載入更多室友 ({filteredBrowseUsers.length - visibleCards} 位)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Why Choose Us - 只在初始狀態或搜尋失敗時顯示 */}
        {(searchState === 'initial' || searchState === 'notFound') && (
        <div className="mt-8 space-y-3">
          <div className="bg-orange-50/60 rounded-xl p-5 md:p-4 border border-orange-100/50">
            <div className="flex items-center">
              <div className="w-14 h-14 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-3xl md:text-2xl">🏡</span>
              </div>
              <div>
                <h4 className="text-lg md:text-base font-bold text-gray-800 mb-1">13 組真實配對成功</h4>
                <p className="text-sm md:text-xs text-gray-600">平均契合度 85%，不是隨機配對</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50/60 rounded-xl p-5 md:p-4 border border-green-100/50">
            <div className="flex items-center">
              <div className="w-14 h-14 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-3xl md:text-2xl">🌈</span>
              </div>
              <div>
                <h4 className="text-lg md:text-base font-bold text-gray-800 mb-1">多元性別友善空間</h4>
                <p className="text-sm md:text-xs text-gray-600">尊重每個人的性別認同與偏好</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50/60 rounded-xl p-5 md:p-4 border border-yellow-100/50">
            <div className="flex items-center">
              <div className="w-14 h-14 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-3xl md:text-2xl">✨</span>
              </div>
              <div>
                <h4 className="text-lg md:text-base font-bold text-gray-800 mb-1">重視生活契合，非交友平台</h4>
                <p className="text-sm md:text-xs text-gray-600">從作息到清潔習慣，找到真正合拍的室友</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* CTA for Survey - 只在初始狀態或搜尋失敗時顯示 */}
        {(searchState === 'initial' || searchState === 'notFound') && (
        <div className="mt-8 bg-orange-50 rounded-xl p-6 text-center shadow-sm border border-orange-100">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-2xl md:text-xl font-bold text-gray-800 mb-5 break-keep">已有 {browseUsers.length} 人在找室友</h3>
          <a
            href="https://forms.gle/iuFj9gA97zhynTKm6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 md:px-6 md:py-2.5 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all shadow-sm text-base md:text-sm"
            style={{ whiteSpace: 'nowrap' }}
          >
            加入配對
          </a>
        </div>
        )}
      </div>

      {/* Friendly Not Found Popup */}
      {showNotFoundPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowNotFoundPopup(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Icon */}
            <div className="text-center mb-5">
              <div className="text-6xl mb-3">🏡</div>
              <h3 className="text-2xl md:text-xl font-bold text-gray-800 mb-2">還沒有您的配對資料</h3>
            </div>

            {/* Two scenarios */}
            <div className="space-y-3 mb-6">
              <div className="bg-orange-50/80 rounded-xl p-4 border border-orange-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">⏳</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 mb-1.5 text-base">如果您剛提交資料</p>
                    <p className="text-sm text-gray-700 leading-relaxed">約需 1-3 天處理，請耐心等待 email 通知</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50/80 rounded-xl p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">✨</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 mb-1.5 text-base">如果您還未填寫資料</p>
                    <p className="text-sm text-gray-700 leading-relaxed">1 分鐘勾勒理想室友，立即開始配對</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <a
                href="https://forms.gle/iuFj9gA97zhynTKm6"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-orange-300 text-gray-800 rounded-full font-semibold hover:bg-orange-400 transition-all text-center text-base"
              >
                開始配對
              </a>
              <button
                onClick={() => setShowNotFoundPopup(false)}
                className="block w-full px-6 py-2.5 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-all text-sm"
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
