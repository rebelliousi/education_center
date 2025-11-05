import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useRateCourse } from "../hooks/useRateCourses";
import { useCourseRatingInfo } from "../hooks/useCourseRatingInfo";
import { useTranslation } from 'react-i18next';

type UserRatingInfo = {
  rating: number;
  created_at: string;
};

export interface SmartRatingBarProps {
  courseId: number;
  compact?: boolean;
}

export const SmartRatingBar: React.FC<SmartRatingBarProps> = ({
  courseId,
  compact = false
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch rating info from backend (average + count)
  const { data: ratingInfo, refetch: refetchRatingInfo } = useCourseRatingInfo(courseId);
  const averageRating = ratingInfo?.average_rating ?? 0;
  const totalVotes = ratingInfo?.rating_count ?? 0;

  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // POST rating to backend
  const rateCourse = useRateCourse(courseId);

  useEffect(() => {
    const savedRating = localStorage.getItem(`course_rating_${courseId}`);
    if (savedRating) {
      setUserRating(JSON.parse(savedRating));
    }
  }, [courseId]);

  const handleStarClick = async (rating: number) => {
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await rateCourse.mutateAsync({ rating });  // POST to backend!
      await refetchRatingInfo();                  // Update average/rate info!
    } catch (e) {
      // Optional: handle errors here
    }
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
            aria-label={t("courses.rate_star", { count: i })} // i18n: "Rate {{count}} stars"
            onClick={() => isInteractive && handleStarClick(i)}
            onMouseEnter={() => isInteractive && setHoveredRating(i)}
            onMouseLeave={() => isInteractive && setHoveredRating(null)}
            className={`
              relative
              ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
              transition-all duration-200
              ${compact ? 'text-sm' : 'text-base'}
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
      <div className="relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 border border-blue-400/30 shadow-lg">
        {renderStars()}
        <span className="ml-1 flex flex-col items-start justify-center">
          <span className="flex items-center gap-1 text-xs font-bold text-white select-none">
            {averageRating.toFixed(1)}
            <span className="ml-1 text-blue-200 font-normal">({totalVotes})</span>
          </span>
        </span>
        {userRating && (
          <div className="relative ml-1">
            <motion.button
              className="text-blue-200 hover:text-yellow-400 transition-colors p-0"
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              whileHover={{ scale: 1.12 }}
              tabIndex={-1}
              style={{background:'none',outline:'none'}}
            >
              <Info size={15} />
            </motion.button>
            <AnimatePresence>
              {showInfoTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 7, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 7, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.17 }}
                  className="absolute right-[-80px] bottom-full mb-2 z-[70] w-max"
                >
                  <div className="
                    backdrop-blur-md border border-blue-700/40
                    bg-blue-900/90 text-white text-[12px] px-3 py-2
                    rounded-lg shadow whitespace-nowrap
                    relative flex flex-col items-center
                  ">
                    {/* i18n başlık! */}
                    <div className="mb-1 text-blue-200">{t('courses.your_rating')}</div>
                    <div className="flex items-center text-yellow-400 font-bold text-lg mb-[2px]">
                      {'★'.repeat(userRating.rating)}
                      {'☆'.repeat(5 - userRating.rating)}
                      <span className="ml-1 text-white text-sm font-normal">
                        ({userRating.rating}/5)
                      </span>
                    </div>
                    {/* Tarihin locale formatı ve çevirisi */}
                    <div className="text-blue-100 text-[11px] text-center leading-tight">
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
            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-100"
          >
            {t("courses.rate")}
          </motion.span>
        )}
        {rateCourse.isError && (
          <span className="absolute right-1 bottom-1 text-red-300 text-[10px]">{t("courses.error")}</span>
        )}
      </div>
    );
  }

  // FULL MODAL/DETAIL VERSION:
  return (
    <div className="relative w-full">
      <motion.div
        className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-xl border border-blue-400/50 p-4 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none rounded-xl" />
        <div className="relative z-10 flex items-center gap-4">
          {renderStars()}
          <span className="ml-1 flex flex-col items-start justify-center">
            <span className="flex items-center gap-1 text-2xl font-bold text-white select-none">
              {averageRating.toFixed(1)}
              <span className="ml-1 text-blue-200 font-normal text-lg">({totalVotes})</span>
            </span>
            {userRating && (
              <span className="text-sm text-blue-300 font-medium mt-0.5">
                {t("courses.average_rate")}
              </span>
            )}
          </span>
          {userRating && (
            <div className="relative ml-1">
              <motion.button
                className="text-blue-200 hover:text-yellow-400 transition-colors p-0"
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                whileHover={{ scale: 1.12 }}
                tabIndex={-1}
                style={{background:'none',outline:'none'}}
              >
                <Info size={18} />
              </motion.button>
              <AnimatePresence>
                {showInfoTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 7, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 7, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.17 }}
                    className="absolute right-0 bottom-full mb-2 z-[70] w-max"
                  >
                    <div className="
                      backdrop-blur-md border border-blue-700/40
                      bg-blue-900/90 text-white text-[12px] px-3 py-2
                      rounded-lg shadow whitespace-nowrap
                      relative flex flex-col items-center
                    ">
                      <div className="mb-1 text-blue-200">{t('courses.your_rating')}</div>
                      <div className="flex items-center text-yellow-400 font-bold text-lg mb-[2px]">
                        {'★'.repeat(userRating.rating)}
                        {'☆'.repeat(5 - userRating.rating)}
                        <span className="ml-1 text-white text-sm font-normal">
                          ({userRating.rating}/5)
                        </span>
                      </div>
                      <div className="text-blue-100 text-[11px] text-center leading-tight">
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
            <span className="absolute right-3 bottom-3 text-red-300 text-xs">{t("courses.error")}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SmartRatingBar;