import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useRateVideo } from '../hooks/useRateVideo';
import { useVideoRatingInfo } from '../hooks/useVideoRatingInfo';
import { useTranslation } from 'react-i18next';

type UserRatingInfo = {
  rating: number;
  created_at: string;
};

export interface SmartVideoRatingBarProps {
  videoId: number | string;
  compact?: boolean;
}

export const SmartVideoRatingBar: React.FC<SmartVideoRatingBarProps> = ({
  videoId,
  compact = false
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mobile detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  useEffect(() => {
    const checkIsMobile = () =>
      typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
    setIsMobileDevice(checkIsMobile());
    const cb = () => setIsMobileDevice(checkIsMobile());
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);

  const { data: ratingInfo, refetch: refetchRatingInfo } = useVideoRatingInfo(videoId);
  const averageRating = ratingInfo?.average_rating ?? 0;
  const totalVotes = ratingInfo?.rating_count ?? 0;

  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const rateVideo = useRateVideo(videoId);

  useEffect(() => {
    const savedRating = localStorage.getItem(`video_rating_${videoId}`);
    if (savedRating) {
      setUserRating(JSON.parse(savedRating));
    }
  }, [videoId]);

  // Show tooltip logic for hover/click/touch
  // Keep tooltip open while the mouse is over the icon or the tooltip
  const openTooltip = () => setShowInfoTooltip(true);
  const closeTooltip = () => setShowInfoTooltip(false);

  // MOBILE: click/touch to toggle, tooltip stays until outside/click/touch again
  // DESKTOP: hover icon/toolip stays open, leaves both to close

  // Stars
  const renderStars = () => {
    const displayRating = hoveredRating ?? (userRating ? userRating.rating : 0);
    const isInteractive = !userRating && !isSubmitting;
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <motion.button
            key={i}
            disabled={!isInteractive}
            aria-label={t("videos.rate_star", { count: i })}
            onClick={() => isInteractive && handleStarClick(i)}
            onMouseEnter={
              isInteractive ? () => setHoveredRating(i) : undefined
            }
            onMouseLeave={
              isInteractive ? () => setHoveredRating(null) : undefined
            }
            className={`
              relative
              ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
              transition-all duration-200
              ${compact ? 'text-sm' : 'text-base'}
              ${
                i <= Math.round(displayRating)
                  ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]'
                  : 'text-gray-300 drop-shadow-[0_0_2px_rgba(96,165,250,0.4)]'
              }
              ${isInteractive && !userRating ? 'hover:text-yellow-300' : ''}
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

  const handleStarClick = async (rating: number) => {
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await rateVideo.mutateAsync({ rating });
      await refetchRatingInfo();
    } catch (e) {}
    const ratingInfo: UserRatingInfo = {
      rating,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(`video_rating_${videoId}`, JSON.stringify(ratingInfo));
    setUserRating(ratingInfo);
    setIsSubmitting(false);
  };

  // Tooltip
  const InfoTooltip = () =>
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`absolute bottom-full mb-2 z-50 w-max max-w-[160px]
        ${compact ? (isMobileDevice ? "right-[-20px]" : "right-[-50px]") : "right-0"}
      `}
      // Stay open while tooltip hovered (desktop)
      onMouseEnter={() => !isMobileDevice && openTooltip()}
      onMouseLeave={() => !isMobileDevice && closeTooltip()}
      // Mobile: touch/click outside (leave icon/tooltip), close
    >
      <div className="backdrop-blur-lg border border-blue-400/60 bg-blue-800/95 text-white text-xs px-3 py-2 rounded-xl shadow-xl relative">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-blue-200 font-semibold text-xs">
            {t('videos.your_rating')}
          </div>
          <div className="flex items-center space-x-1">
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                className={`text-base ${
                  i <= userRating!.rating
                    ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]'
                    : 'text-gray-400'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-white font-bold text-sm bg-blue-600/50 px-2 py-1 rounded">
              {userRating!.rating}/5
            </span>
          </div>
          <div className="text-blue-100 text-[11px] text-center leading-tight pt-1 border-t border-blue-600/40 w-full">
            {t("videos.rating_date", {
              date: new Date(userRating!.created_at)
                .toLocaleDateString(lang, {month:'short', day:'numeric', year:'numeric'})
            })}
          </div>
        </div>
        <div className="absolute top-full left-4 transform -translate-x-1/2 border-4 border-transparent border-t-blue-800/95"></div>
      </div>
    </motion.div>;

  // Listen for click/touch outside to close tooltip on mobile
  useEffect(() => {
    if (!showInfoTooltip || !isMobileDevice) return;
    const close = (e: TouchEvent | MouseEvent) => {
      // If click outside icon or tooltip => close
      const target = e.target as HTMLElement;
      if (!target.closest('.info-tooltip-trigger') && !target.closest('.info-tooltip-content')) {
        setShowInfoTooltip(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [showInfoTooltip, isMobileDevice]);

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
          {userRating && (
            <div className="relative">
              <motion.button
                className="info-tooltip-trigger text-blue-500 hover:text-blue-400 transition-all duration-200 p-1 rounded-full hover:bg-blue-500/10"
                // Desktop: hover opens, leaves closes
                onMouseEnter={() => !isMobileDevice && openTooltip()}
                onMouseLeave={() => !isMobileDevice && closeTooltip()}
                // Mobile: tap opens, tap outside closes
                onClick={e => isMobileDevice && setShowInfoTooltip(prev => !prev)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={-1}
              >
                <Info size={14} />
              </motion.button>
              <AnimatePresence>
                {showInfoTooltip && (
                  // Add selector for outside click/touch close
                  <div className="info-tooltip-content">
                    <InfoTooltip />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        {!userRating && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50"
          >
            {t("videos.rate")}
          </motion.span>
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
        {userRating && (
          <div className="relative">
            <motion.button
              className="info-tooltip-trigger text-blue-500 hover:text-blue-400 transition-all duration-200 p-1 rounded-full hover:bg-blue-500/10"
              onMouseEnter={() => !isMobileDevice && openTooltip()}
              onMouseLeave={() => !isMobileDevice && closeTooltip()}
              onClick={e => isMobileDevice && setShowInfoTooltip(prev => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              tabIndex={-1}
            >
              <Info size={16} />
            </motion.button>
            <AnimatePresence>
              {showInfoTooltip && (
                <div className="info-tooltip-content">
                  <InfoTooltip />
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {!userRating && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/30 text-blue-100 border border-blue-400/50"
        >
          {t("videos.rate")}
        </motion.span>
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