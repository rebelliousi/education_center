import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useRateCourse } from "../hooks/useRateCourses";
import { useTranslation } from 'react-i18next';

type UserRatingInfo = {
  rating: number;
  created_at: string;
};

export interface SmartRatingBarProps {
  courseId: number;
  ratingData?: {
    average_rating: number;
    rating_count: number;
  };
  compact?: boolean;
}

export const SmartRatingBar: React.FC<SmartRatingBarProps> = ({
  courseId,
  ratingData,
  compact = false
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Device type detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const checkIsMobile = () =>
      window.matchMedia('(max-width: 640px)').matches;
    setIsMobileDevice(checkIsMobile());
    window.addEventListener('resize', () => setIsMobileDevice(checkIsMobile()));
    return () =>
      window.removeEventListener('resize', () => setIsMobileDevice(checkIsMobile()));
  }, []);

  // Artık GET rating backend hook yok! Data prop'tan geliyor.
  const averageRating = ratingData?.average_rating ?? 0;
  const totalVotes = ratingData?.rating_count ?? 0;

  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // POST rating to backend (aynı şekilde kaldı)
  const rateCourse = useRateCourse(courseId);

  useEffect(() => {
    const savedRating = localStorage.getItem(`course_rating_${courseId}`);
    if (savedRating) {
      setUserRating(JSON.parse(savedRating));
    }
  }, [courseId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (showInfoTooltip) {
        const target = e.target as HTMLElement;
        if (
          !target.closest('.info-tooltip-trigger') &&
          !target.closest('.info-tooltip-content')
        ) {
          setShowInfoTooltip(false);
        }
      }
    };
    if (showInfoTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showInfoTooltip]);

  const handleInfoMouseEnter = (e: React.MouseEvent) => {
    if (!isMobileDevice) setShowInfoTooltip(true);
  };
  const handleInfoMouseLeave = (e: React.MouseEvent) => {
    if (!isMobileDevice) setShowInfoTooltip(false);
  };
  const handleInfoTouch = (e: React.TouchEvent) => {
    if (isMobileDevice) {
      e.preventDefault();
      setShowInfoTooltip(prev => !prev);
    }
  };

  const handleStarClick = async (rating: number) => {
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await rateCourse.mutateAsync({ rating });
      // Burada ratingData güncellenmesini ana componentte tetikle!
      // (refetch fonksiyonunu yukarıdan gönderebilirsin veya backend hook'tan dönecek şekilde güncelle)
    } catch (e) {}
    const ratingInfo: UserRatingInfo = {
      rating,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(`course_rating_${courseId}`, JSON.stringify(ratingInfo));
    setUserRating(ratingInfo);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSubmitting(false);
  };

  // Only show filled stars for hover OR user's own rating.
  const renderStars = () => {
    const displayRating = hoveredRating ?? (userRating ? userRating.rating : 0);
    const roundedDisplay = Math.round(displayRating);
    const isInteractive = !userRating && !isSubmitting;
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <motion.button
            key={i}
            disabled={!isInteractive}
            aria-label={t("courses.rate_star", { count: i })}
            onClick={() => isInteractive && handleStarClick(i)}
            onMouseEnter={() => isInteractive && setHoveredRating(i)}
            onMouseLeave={() => isInteractive && setHoveredRating(null)}
            className={`
              relative
              ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
              transition-all duration-200
              ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}
              ${i <= roundedDisplay
                ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'text-white/40'
              }
            `}
            whileHover={isInteractive ? { scale: 1.12 } : undefined}
          >
            {i <= roundedDisplay ? '★' : '☆'}
          </motion.button>
        ))}
      </div>
    );
  };

  // COMPACT VERSION
  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 border border-blue-400/30 shadow-lg">
        {renderStars()}
        <span className="ml-0.5 sm:ml-1 flex flex-col items-start justify-center">
          <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold text-white select-none">
            {averageRating.toFixed(1)}
            <span className="ml-0.5 sm:ml-1 text-blue-200 font-normal text-[9px] sm:text-xs">({totalVotes})</span>
          </span>
        </span>
        {userRating && (
          <div className="relative ml-0.5 sm:ml-1">
            <motion.button
              className="info-tooltip-trigger text-blue-200 hover:text-yellow-400 active:text-yellow-400 transition-colors p-1 touch-manipulation"
              onMouseEnter={handleInfoMouseEnter}
              onMouseLeave={handleInfoMouseLeave}
              onTouchStart={handleInfoTouch}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              aria-label="Show rating info"
              style={{background:'none',outline:'none', WebkitTapHighlightColor: 'transparent'}}
            >
              <Info size={13} className="sm:w-[15px] sm:h-[15px] pointer-events-none" />
            </motion.button>
            <AnimatePresence>
              {showInfoTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 7, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 7, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.17 }}
                  className="info-tooltip-content absolute right-[-20px] sm:right-[-80px] bottom-full mb-2 z-[70] w-max"
                  onMouseLeave={() => { if (!isMobileDevice) setShowInfoTooltip(false); }}
                >
                  <div className="
                    backdrop-blur-md border border-blue-700/40
                    bg-blue-900/90 text-white text-[10px] sm:text-[12px] px-2.5 sm:px-3 py-1.5 sm:py-2
                    rounded-lg shadow whitespace-nowrap
                    relative flex flex-col items-center
                  ">
                    <div className="mb-0.5 sm:mb-1 text-blue-200 text-[9px] sm:text-[11px]">{t('courses.your_rating')}</div>
                    <div className="flex items-center text-yellow-400 font-bold text-base sm:text-lg mb-[2px]">
                      {'★'.repeat(userRating.rating)}
                      {'☆'.repeat(5 - userRating.rating)}
                      <span className="ml-1 text-white text-xs sm:text-sm font-normal">
                        ({userRating.rating}/5)
                      </span>
                    </div>
                    <div className="text-blue-100 text-[9px] sm:text-[11px] text-center leading-tight">
                      {
                        t("courses.rating_date", {
                          date: new Date(userRating.created_at)
                            .toLocaleDateString(lang, {month:'short', day:'numeric', year:'numeric'})
                        })
                      }
                    </div>
                    <div className="absolute left-4 top-full -translate-x-1/2">
                      <div className="border-4 border-transparent border-t-blue-900/90"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {!userRating && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[8px] sm:text-[9px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-100"
          >
            {t("courses.rate")}
          </motion.span>
        )}
        {rateCourse.isError && (
          <span className="absolute right-1 bottom-1 text-red-300 text-[9px] sm:text-[10px]">{t("courses.error")}</span>
        )}
      </div>
    );
  }

  // FULL MODAL/DETAIL VERSION:
  return (
    <div className="relative w-full">
      <motion.div
        className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-xl border border-blue-400/50 p-3 sm:p-4 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none rounded-xl" />
        <div className="relative z-10 flex items-center gap-2 sm:gap-4">
          {renderStars()}
          <span className="ml-0.5 sm:ml-1 flex flex-col items-start justify-center">
            <span className="flex items-center gap-0.5 sm:gap-1 text-xl sm:text-2xl font-bold text-white select-none">
              {averageRating.toFixed(1)}
              <span className="ml-0.5 sm:ml-1 text-blue-200 font-normal text-base sm:text-lg">({totalVotes})</span>
            </span>
            {userRating && (
              <span className="text-xs sm:text-sm text-blue-300 font-medium mt-0.5">
                {t("courses.average_rate")}
              </span>
            )}
          </span>
          {userRating && (
            <div className="relative ml-0.5 sm:ml-1">
              <motion.button
                className="info-tooltip-trigger text-blue-200 hover:text-yellow-400 active:text-yellow-400 transition-colors p-0"
                onMouseEnter={handleInfoMouseEnter}
                onMouseLeave={handleInfoMouseLeave}
                onTouchStart={handleInfoTouch}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={-1}
                style={{background:'none',outline:'none'}}
              >
                <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
              </motion.button>
              <AnimatePresence>
                {showInfoTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 7, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 7, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.17 }}
                    className="info-tooltip-content absolute right-0 bottom-full mb-2 z-[70] w-max"
                    onMouseLeave={() => { if (!isMobileDevice) setShowInfoTooltip(false); }}
                  >
                    <div className="
                      backdrop-blur-md border border-blue-700/40
                      bg-blue-900/90 text-white text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-1.5 sm:py-2
                      rounded-lg shadow whitespace-nowrap
                      relative flex flex-col items-center
                    ">
                      <div className="mb-0.5 sm:mb-1 text-blue-200 text-[10px] sm:text-[11px]">{t('courses.your_rating')}</div>
                      <div className="flex items-center text-yellow-400 font-bold text-base sm:text-lg mb-[2px]">
                        {'★'.repeat(userRating.rating)}
                        {'☆'.repeat(5 - userRating.rating)}
                        <span className="ml-1 text-white text-xs sm:text-sm font-normal">
                          ({userRating.rating}/5)
                        </span>
                      </div>
                      <div className="text-blue-100 text-[10px] sm:text-[11px] text-center leading-tight">
                        { t("courses.rating_date", {
                            date: new Date(userRating.created_at)
                              .toLocaleDateString(lang, {month:'short', day:'numeric', year:'numeric'})
                          })
                        }
                      </div>
                      <div className="absolute left-4 top-full -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-blue-900/90"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {rateCourse.isError && (
            <span className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 text-red-300 text-[10px] sm:text-xs">{t("courses.error")}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SmartRatingBar;