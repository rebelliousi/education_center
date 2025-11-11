import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  onRatingSuccess?: () => void;
}

export const SmartRatingBar: React.FC<SmartRatingBarProps> = ({
  courseId,
  ratingData,
  compact = false,
  onRatingSuccess
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingMode, setIsRatingMode] = useState(false);
  
  const [optimisticRating, setOptimisticRating] = useState<{
    average_rating: number;
    rating_count: number;
  } | null>(null);

  // DÜZELTME: optimisticRating'i dependency'den çıkar
  useEffect(() => {
    if (ratingData && optimisticRating) {
      setOptimisticRating(null);
    }
  }, [ratingData]); // optimisticRating'i kaldırdık

  const displayRatingData = optimisticRating || ratingData;
  const averageRating = displayRatingData?.average_rating ?? 0;
  const totalVotes = displayRatingData?.rating_count ?? 0;

  const { t } = useTranslation();
  const rateCourse = useRateCourse(courseId);

  useEffect(() => {
    const savedRating = localStorage.getItem(`course_rating_${courseId}`);
    if (savedRating) {
      setUserRating(JSON.parse(savedRating));
    }
  }, [courseId]);

  const handleRateButtonClick = () => {
    setIsRatingMode(true);
  };

  const handleStarClick = async (rating: number) => {
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (ratingData) {
        const currentTotal = ratingData.average_rating * ratingData.rating_count;
        const newCount = ratingData.rating_count + 1;
        const newAverage = (currentTotal + rating) / newCount;
        
        setOptimisticRating({
          average_rating: newAverage,
          rating_count: newCount
        });
      }
      
      await rateCourse.mutateAsync({ rating });
      
      if (onRatingSuccess) {
        onRatingSuccess();
      }
      
      const ratingInfo: UserRatingInfo = {
        rating,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(`course_rating_${courseId}`, JSON.stringify(ratingInfo));
      setUserRating(ratingInfo);
      setIsRatingMode(false);
    } catch (e) {
      console.error('Rating failed:', e);
      setOptimisticRating(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    let displayRating = 0;
    let roundedDisplay = 0;
    let isInteractive = false;

    if (userRating) {
      displayRating = averageRating;
      roundedDisplay = Math.round(averageRating);
      isInteractive = false;
    } else if (isRatingMode) {
      displayRating = hoveredRating ?? 0;
      roundedDisplay = Math.round(displayRating);
      isInteractive = true;
    } else {
      displayRating = averageRating;
      roundedDisplay = Math.round(averageRating);
      isInteractive = false;
    }

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
        {!userRating && !isRatingMode && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleRateButtonClick}
            className="text-[8px] sm:text-[9px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-colors cursor-pointer"
          >
            {t("courses.rate")}
          </motion.button>
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
          {!userRating && !isRatingMode && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleRateButtonClick}
              className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 transition-colors cursor-pointer"
            >
              {t("courses.rate")}
            </motion.button>
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