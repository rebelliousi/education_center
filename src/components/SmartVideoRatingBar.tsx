import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRateVideo } from '../hooks/useRateVideo';
import { useVideoRatingInfo } from '../hooks/useVideoRatingInfo';
import { useTranslation } from 'react-i18next';

type UserRatingInfo = {
  rating: number;
  created_at: string;
};

export interface SmartVideoRatingBarProps {
  videoId: number | string;
  ratingData?: {
    average_rating: number;
    rating_count: number;
  };
  compact?: boolean;
  onRatingSuccess?: () => void;
}

export const SmartVideoRatingBar: React.FC<SmartVideoRatingBarProps> = ({
  videoId,
  ratingData,
  compact = false,
  onRatingSuccess
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingMode, setIsRatingMode] = useState(false);

  // Optimistic update için local state
  const [optimisticRating, setOptimisticRating] = useState<{
    average_rating: number;
    rating_count: number;
  } | null>(null);

  // Backend rating data (hook)
  const { data: ratingInfoData, refetch: refetchRatingInfo } = useVideoRatingInfo(videoId);

  useEffect(() => {
    if ((ratingData || ratingInfoData) && optimisticRating) {
      setOptimisticRating(null);
    }
  }, [ratingData, ratingInfoData]);

  // Gösterilecek ratingData: Optimistic > Prop > Hook
  const displayRatingData = optimisticRating || ratingData || ratingInfoData;
  const averageRating = displayRatingData?.average_rating ?? 0;
  const totalVotes = displayRatingData?.rating_count ?? 0;

  const { t } = useTranslation();
  const rateVideo = useRateVideo(videoId);

  useEffect(() => {
    const savedRating = localStorage.getItem(`video_rating_${videoId}`);
    if (savedRating) {
      setUserRating(JSON.parse(savedRating));
    }
  }, [videoId]);

  const handleRateButtonClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsRatingMode(true);
  };

  const handleStarClick = async (rating: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const info = ratingData || ratingInfoData;
      if (info) {
        const currentTotal = info.average_rating * info.rating_count;
        const newCount = info.rating_count + 1;
        const newAverage = (currentTotal + rating) / newCount;
        setOptimisticRating({
          average_rating: newAverage,
          rating_count: newCount
        });
      }

      await rateVideo.mutateAsync({ rating });
      await refetchRatingInfo();

      if (onRatingSuccess) {
        onRatingSuccess();
      }

      const userRatingObj: UserRatingInfo = {
        rating,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(`video_rating_${videoId}`, JSON.stringify(userRatingObj));
      setUserRating(userRatingObj);
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
        {[1, 2, 3, 4, 5].map(i => (
          <motion.button
            key={i}
            disabled={!isInteractive}
            aria-label={t("videos.rate_star", { count: i })}
            onClick={(e) => {
              e.stopPropagation();
              if (isInteractive) handleStarClick(i, e);
            }}
            onMouseEnter={() => isInteractive && setHoveredRating(i)}
            onMouseLeave={() => isInteractive && setHoveredRating(null)}
            className={`
              relative
              ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
              transition-all duration-200
              ${compact ? 'text-sm' : 'text-base'}
              ${i <= roundedDisplay
                ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]'
                : 'text-gray-300 drop-shadow-[0_0_2px_rgba(96,165,250,0.4)]'
              }
              ${isInteractive ? 'hover:text-yellow-300' : ''}
            `}
            whileHover={isInteractive ? { scale: 1.15 } : undefined}
            whileTap={isInteractive ? { scale: 0.95 } : undefined}
          >
            ★
          </motion.button>
        ))}
      </div>
    );
  };

  // COMPACT VERSION
  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-2">
        {renderStars()}
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
            {averageRating.toFixed(1)}
            <span className="text-blue-500 font-semibold text-[11px]">
              ({totalVotes})
            </span>
          </span>
        </div>
        {!userRating && !isRatingMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => handleRateButtonClick(e)}
            className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50 hover:bg-blue-500/40 transition-colors cursor-pointer"
          >
            {t("videos.rate")}
          </motion.button>
        )}
        {rateVideo.isError && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-[10px] font-medium"
          >
            {t("videos.error")}
          </motion.span>
        )}
      </div>
    );
  }

  // FULL VERSION
  return (
    <div className="relative inline-flex items-center gap-3">
      {renderStars()}
      <div className="flex items-center gap-2">
        <span className="flex flex-col items-start justify-center">
          <span className="flex items-center gap-1 text-base font-bold text-blue-600">
            {averageRating.toFixed(1)}
            <span className="text-blue-500 font-semibold text-sm">
              ({totalVotes})
            </span>
          </span>
        </span>
      </div>
      {!userRating && !isRatingMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => handleRateButtonClick(e)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50 hover:bg-blue-500/40 transition-colors cursor-pointer"
        >
          {t("videos.rate")}
        </motion.button>
      )}
      {rateVideo.isError && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-xs font-medium"
        >
          {t("videos.error")}
        </motion.span>
      )}
    </div>
  );
};

export default SmartVideoRatingBar;