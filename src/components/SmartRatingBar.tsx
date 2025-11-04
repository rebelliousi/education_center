import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Check } from 'lucide-react';

type UserRatingInfo = {
  rating: number;
  created_at: string;
};

interface SmartRatingBarProps {
  courseId: number;
  averageRating: number;
  totalVotes: number;
  compact?: boolean;
}

const SmartRatingBar: React.FC<SmartRatingBarProps> = ({
  courseId,
  averageRating,
  totalVotes,
  compact = false
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<UserRatingInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    average: averageRating,
    count: totalVotes
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedRating = localStorage.getItem(`course_rating_${courseId}`);
    if (savedRating) {
      const parsed = JSON.parse(savedRating);
      setUserRating(parsed);
    }
  }, [courseId]);

  const handleStarClick = async (rating: number) => {
    if (userRating || isSubmitting) return;
    setIsSubmitting(true);

    const ratingInfo: UserRatingInfo = {
      rating,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(`course_rating_${courseId}`, JSON.stringify(ratingInfo));
    setUserRating(ratingInfo);
    setShowSuccess(true);
    setCurrentStats(prev => ({
      average: Math.round(((prev.average * prev.count) + rating) / (prev.count + 1) * 10) / 10,
      count: prev.count + 1
    }));
    setTimeout(() => setShowSuccess(false), 3000);
    setIsSubmitting(false);
  };

  const renderStars = () => {
    const displayRating = hoveredRating ?? (userRating ? userRating.rating : currentStats.average);
    const roundedDisplay = Math.round(displayRating);
    const isInteractive = !userRating && !isSubmitting;
    return (
      <div className={`flex gap-[2px] ${compact ? "text-[15px]" : "text-[20px]"} tracking-wider`}>
        {[1,2,3,4,5].map(i => (
          <motion.button
            key={i}
            disabled={!isInteractive}
            aria-label={`rate ${i} star${i > 1 ? "s" : ""}`}
            onClick={() => isInteractive && handleStarClick(i)}
            onMouseEnter={() => isInteractive && setHoveredRating(i)}
            onMouseLeave={() => isInteractive && setHoveredRating(null)}
            className={`
              px-0.5 py-0
              ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
              ${userRating ? 'text-gray-400' : (hoveredRating && i <= hoveredRating) ? 'text-yellow-500' : (i <= roundedDisplay ? 'text-yellow-500' : 'text-gray-300')}
            `}
            whileHover={isInteractive ? { scale: 1.1 } : undefined}
          >
            {i <= roundedDisplay ? '★' : '☆'}
          </motion.button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPromptText = () => {
    if (showSuccess) return "Your rating has been saved!";
    if (userRating) return "";
    if (hoveredRating) return `Click to rate ${hoveredRating} star${hoveredRating > 1 ? 's' : ''}`;
    return "Click to add your rating";
  };

  // --- CORE RENDER ---
  return (
    <div className={`
      relative rounded-xl border border-gray-200 bg-white/80 flex flex-col gap-1 items-start
      ${compact ? "px-2 py-1" : "px-3 py-2"}
      shadow-sm w-full overflow-visible
    `}>
      <div className="flex items-center gap-2 w-full">
        {renderStars()}
        <span className={`font-bold ${compact ? 'text-xs' : 'text-base'} ml-1`}>
          <span className={userRating ? 'text-gray-500' : 'text-gray-800'}>
            {(typeof currentStats.average === "number" && !isNaN(currentStats.average))
              ? currentStats.average.toFixed(1)
              : "--"}
          </span>
          <span className="text-yellow-500 ml-0.5">★</span>
        </span>
        {userRating && (
          <div className="relative ml-1">
            <motion.button
              className="text-gray-400 hover:text-yellow-500 transition-colors p-0"
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              whileHover={{ scale: 1.12 }}
            >
              <Info size={compact ? 16 : 18} />
            </motion.button>
            <AnimatePresence>
              {showInfoTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 7, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 7, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.17 }}
                  className="
                    absolute left-[-80%] bottom-full  pb-1 -translate-x-1/2 mb-[6px] z-[70]
                    sm:max-w-[110px] max-w-[140px] w-max
                  "
                >
                  <div className="
                    backdrop-blur-md border border-gray-700/40
                    bg-gray-900/80 text-white text-[11px] px-2 py-1
                    rounded-lg shadow whitespace-nowrap
                    relative flex flex-col items-center
                  ">
                    <div className="mb-1 text-blue-200">Your Rating</div>
                    <motion.div
                      initial={false}
                      animate={{ scale: showInfoTooltip ? 1.1 : 1 }}
                      className="flex items-center text-yellow-400 font-bold text-[13px] mb-[2px]"
                    >
                      {'★'.repeat(userRating.rating)}
                      {'☆'.repeat(5 - userRating.rating)}
                      <span className="ml-1 text-white text-xs font-normal">
                        ({userRating.rating}/5)
                      </span>
                    </motion.div>
                    <div className="text-blue-100 text-[10px] text-center leading-tight">
                      {formatDate(userRating.created_at)}
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute left-1/2 top-full -translate-x-1/2">
                      <div className="border-4 border-transparent border-t-gray-900/80"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} pl-0`}>
        {(typeof currentStats.count === "number" && !isNaN(currentStats.count))
          ? currentStats.count.toLocaleString()
          : "0"} {currentStats.count === 1 ? 'rating' : 'ratings'}
      </div>
      <AnimatePresence>
        {(getPromptText() && !userRating) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.14 }}
            className={`flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'} ${
              showSuccess ? 'text-green-600 font-semibold' : 'text-gray-500'
            }`}
          >
            {showSuccess && <Check size={compact ? 11 : 13} className="text-green-600 mr-1" />}
            💬 {getPromptText()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartRatingBar;