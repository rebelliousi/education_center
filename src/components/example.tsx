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
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => {
          const isFilled = i <= roundedDisplay;
          const isHovered = hoveredRating && i <= hoveredRating;
          
          return (
            <motion.button
              key={i}
              disabled={!isInteractive}
              aria-label={`rate ${i} star${i > 1 ? "s" : ""}`}
              onClick={() => isInteractive && handleStarClick(i)}
              onMouseEnter={() => isInteractive && setHoveredRating(i)}
              onMouseLeave={() => isInteractive && setHoveredRating(null)}
              className={`
                relative
                ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
                transition-all duration-200
                ${compact ? 'text-sm' : 'text-base'}
              `}
              whileHover={isInteractive ? { 
                scale: 1.15,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              } : undefined}
              whileTap={isInteractive ? { scale: 0.9 } : undefined}
            >
              {/* Glow effect */}
              {(isFilled || isHovered) && isInteractive && (
                <motion.div
                  className="absolute inset-0 rounded-full blur-sm"
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <span className={`
                relative z-10
                ${isFilled || isHovered
                  ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]'
                  : 'text-white/30'
                }
              `}>
                {isFilled ? '★' : '☆'}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPromptText = () => {
    if (showSuccess) return "Saved!";
    if (userRating) return "";
    if (hoveredRating) return `Rate ${hoveredRating}★`;
    return "Rate";
  };

  // COMPACT VERSION (for card overlay)
  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-700/80 border border-blue-400/30 shadow-lg">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-lg pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2">
          {renderStars()}
          
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {(typeof currentStats.average === "number" && !isNaN(currentStats.average))
                ? currentStats.average.toFixed(1)
                : "--"}
            </span>
            
            {userRating && (
              <div className="relative">
                <motion.button
                  className="p-0.5 rounded-full hover:bg-blue-500/30 transition-colors"
                  onMouseEnter={() => setShowInfoTooltip(true)}
                  onMouseLeave={() => setShowInfoTooltip(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoTooltip(!showInfoTooltip);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info size={12} className="text-blue-200" />
                </motion.button>
                
                <AnimatePresence>
                  {showInfoTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-[100] w-28"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-900/95 border border-blue-400/30 text-white p-2 rounded-lg shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-lg pointer-events-none" />
                        <div className="relative z-10">
                          <div className="text-[9px] text-blue-300 mb-1 font-medium">Your Rating</div>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                            <span className="drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]">
                              {'★'.repeat(userRating.rating)}{'☆'.repeat(5 - userRating.rating)}
                            </span>
                            <span className="text-white/90 text-[10px]">
                              ({userRating.rating})
                            </span>
                          </div>
                          <div className="text-[8px] text-blue-400/70 mt-1">
                            {formatDate(userRating.created_at)}
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full">
                          <div className="border-4 border-transparent border-t-blue-900/95" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {!userRating && getPromptText() && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                showSuccess 
                  ? 'bg-green-500/80 text-white border border-green-400/30' 
                  : 'bg-blue-500/30 text-blue-100 border border-blue-400/30'
              }`}
            >
              {showSuccess && <Check size={8} className="inline mr-0.5" />}
              {getPromptText()}
            </motion.span>
          )}
        </div>
      </div>
    );
  }

  // FULL VERSION (for modal/detail page)
  return (
    <div className="relative w-full">
      <motion.div 
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-4 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none rounded-xl" />
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {renderStars()}
              
              <div className="flex items-baseline gap-1">
                <motion.span 
                  className="text-2xl font-bold bg-gradient-to-br from-yellow-300 to-yellow-500 bg-clip-text text-transparent"
                  key={currentStats.average}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {(typeof currentStats.average === "number" && !isNaN(currentStats.average))
                    ? currentStats.average.toFixed(1)
                    : "--"}
                </motion.span>
                <span className="text-gray-500 text-sm font-medium">/5</span>
              </div>
            </div>

            {userRating && (
              <div className="relative">
                <motion.button
                  className="p-2 rounded-full bg-gray-800/50 hover:bg-yellow-500/20 transition-colors border border-gray-700/50"
                  onMouseEnter={() => setShowInfoTooltip(true)}
                  onMouseLeave={() => setShowInfoTooltip(false)}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info size={16} className="text-gray-400" />
                </motion.button>
                
                <AnimatePresence>
                  {showInfoTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 bottom-full mb-2 z-[70] min-w-[160px]"
                    >
                      <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 text-white p-3 rounded-lg shadow-2xl">
                        <div className="text-xs text-gray-400 font-medium mb-1">Your Rating</div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-lg font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                            {'★'.repeat(userRating.rating)}{'☆'.repeat(5 - userRating.rating)}
                          </span>
                          <span className="text-white font-semibold">
                            {userRating.rating}/5
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {formatDate(userRating.created_at)}
                        </div>
                        <div className="absolute right-4 top-full">
                          <div className="border-[6px] border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">
                {currentStats.count.toLocaleString()} {currentStats.count === 1 ? 'rating' : 'ratings'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {getPromptText() && !userRating && (
                <motion.div
                  key={showSuccess ? 'success' : 'prompt'}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`
                    flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                    ${showSuccess 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'}
                  `}
                >
                  {showSuccess ? (
                    <>
                      <Check size={12} strokeWidth={3} />
                      <span>{getPromptText()}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400">✨</span>
                      <span>Tap to rate</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Demo with card example
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Card Rating System</h1>
          <p className="text-gray-600">Compact overlay design for course cards</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Card Example 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" 
                alt="Course" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Rating overlay - BOTTOM LEFT */}
              <div className="absolute bottom-3 left-3">
                <SmartRatingBar
                  courseId={1}
                  averageRating={4.7}
                  totalVotes={1234}
                  compact
                />
              </div>
              
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  Beginner
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced JavaScript</h3>
              <p className="text-sm text-gray-600 mb-4">Master modern JavaScript with ES6+ features</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Course Card Example 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative h-48 bg-gradient-to-br from-green-500 to-teal-600">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" 
                alt="Course" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-3 left-3">
                <SmartRatingBar
                  courseId={2}
                  averageRating={4.3}
                  totalVotes={856}
                  compact
                />
              </div>
              
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  Intermediate
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">React Development</h3>
              <p className="text-sm text-gray-600 mb-4">Build modern web apps with React</p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Course Card Example 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400" 
                alt="Course" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-3 left-3">
                <SmartRatingBar
                  courseId={3}
                  averageRating={4.9}
                  totalVotes={2341}
                  compact
                />
              </div>
              
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-orange-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  Advanced
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full Stack Mastery</h3>
              <p className="text-sm text-gray-600 mb-4">Complete web development bootcamp</p>
              <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Modal Example */}
        <div className="bg-white rounded-xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4">Full Size (Modal/Detail View)</h3>
          <SmartRatingBar
            courseId={999}
            averageRating={4.5}
            totalVotes={523}
          />
        </div>
      </div>
    </div>
  );
}