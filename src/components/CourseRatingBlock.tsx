// import React, { useState, useEffect } from "react";
// import { Star, Sparkles } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRateCourse } from "../hooks/useRateCourses";
// import { useCourseRatingInfo } from "../hooks/useCourseRatingInfo";

// interface SmartRatingBarProps {
//   courseId: number | string;
//   averageRating: number | string;
//   totalVotes: number;
//   courseTitle?: string;
//   compact?: boolean;
// }

// function formatNumber(n: number) {
//   return n.toLocaleString("tr-TR");
// }

// export default function SmartRatingBar({
//   courseId,
//   averageRating,
//   totalVotes,
//   courseTitle,
//   compact = false,
// }: SmartRatingBarProps) {
//   const localKey = `course_${courseId}_rating`;
//   const [userRating, setUserRating] = useState<number | null>(null);
//   const [userDate, setUserDate] = useState<string | null>(null);
//   const [isVoting, setIsVoting] = useState(false);
//   const [starHover, setStarHover] = useState(0);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const { data: ratingInfo, refetch: refetchRatingInfo } = useCourseRatingInfo(courseId);
//   const rateMutation = useRateCourse(courseId);

//   useEffect(() => {
//     const saved = localStorage.getItem(localKey);
//     if (saved) {
//       try {
//         const { rating, date } = JSON.parse(saved);
//         setUserRating(rating);
//         setUserDate(date);
//       } catch {
//         setUserRating(null);
//         setUserDate(null);
//       }
//     }
//   }, [localKey]);

//   let avg = ratingInfo?.average_rating ?? averageRating;
//   const votes = ratingInfo?.rating_count ?? totalVotes;
//   const avgNum = typeof avg === "number" ? avg : parseFloat(String(avg));

//   async function handleVote(rating: number) {
//     if (userRating) return;
//     setIsVoting(true);
//     try {
//       await rateMutation.mutateAsync({ rating });
//       const now = new Date();
//       localStorage.setItem(
//         localKey,
//         JSON.stringify({
//           rating,
//           date: now.toLocaleDateString("tr-TR", {
//             day: "2-digit",
//             month: "long",
//             year: "numeric",
//           }),
//         })
//       );
//       setUserRating(rating);
//       setUserDate(
//         now.toLocaleDateString("tr-TR", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       );
//       setShowSuccess(true);
//       refetchRatingInfo();
//     } finally {
//       setIsVoting(false);
//       setTimeout(() => setShowSuccess(false), 2500);
//     }
//   }

//   let fillCount = starHover || userRating || 0;

//   return (
//     <div className="w-full">
//       {/* Kompakt Rating Display */}
//       <motion.div
//         className="backdrop-blur-sm bg-white/90 rounded-xl px-3 py-2 shadow-sm border border-blue-100/50"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Yıldızlar ve Skor */}
//         <div className="flex items-center justify-between mb-2">
//           <motion.div layout className="flex items-center gap-0.5">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <motion.button
//                 key={i}
//                 disabled={!!userRating || isVoting}
//                 className={`p-0.5 border-none bg-transparent outline-none ${
//                   userRating ? "cursor-default" : "cursor-pointer"
//                 }`}
//                 style={{ pointerEvents: userRating ? "none" : undefined }}
//                 onMouseEnter={() => {
//                   if (!userRating && !isVoting) setStarHover(i);
//                 }}
//                 onMouseLeave={() => {
//                   if (!userRating && !isVoting) setStarHover(0);
//                 }}
//                 onClick={() => {
//                   if (!userRating && !isVoting) handleVote(i);
//                 }}
//                 aria-label={userRating ? undefined : `${i} yıldız ver`}
//                 whileHover={
//                   !userRating && !isVoting 
//                     ? { scale: 1.15, rotate: [0, -8, 8, 0] } 
//                     : undefined
//                 }
//                 whileTap={!userRating && !isVoting ? { scale: 0.9 } : undefined}
//                 transition={{ type: "spring", stiffness: 500, damping: 20 }}
//               >
//                 {/* Glow effect */}
//                 {fillCount >= i && !userRating && (
//                   <motion.div
//                     className="absolute inset-0 rounded-full blur-sm"
//                     style={{
//                       background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
//                     }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                   />
//                 )}
                
//                 <Star
//                   className="h-5 w-5 relative z-10"
//                   color={userRating ? "#9CA3AF" : fillCount >= i ? "#F59E0B" : "#D1D5DB"}
//                   fill={fillCount >= i ? (userRating ? "#9CA3AF" : "#FBBF24") : "transparent"}
//                   strokeWidth={2.5}
//                   style={{
//                     transition: "all 0.15s ease",
//                     filter: fillCount >= i && !userRating ? "drop-shadow(0 0 4px rgba(251,191,36,0.4))" : "none",
//                   }}
//                 />
//               </motion.button>
//             ))}
//           </motion.div>

//           {/* Score Badge */}
//           <motion.div 
//             className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
//             animate={showSuccess ? { scale: [1, 1.1, 1] } : {}}
//           >
//             <span className="text-sm font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
//               {typeof avgNum === "number" && !isNaN(avgNum) ? avgNum.toFixed(1) : "--"}
//             </span>
//             <Star className="h-3.5 w-3.5 text-yellow-500" fill="#FBBF24" />
//           </motion.div>
//         </div>

//         {/* Status Message */}
//         <div className="min-h-[20px]">
//           <AnimatePresence mode="wait">
//             {showSuccess ? (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="flex items-center gap-1.5 text-xs"
//               >
//                 <Sparkles className="h-3.5 w-3.5 text-green-600" />
//                 <span className="text-green-700 font-semibold">Teşekkürler! 🎉</span>
//               </motion.div>
//             ) : userRating ? (
//               <motion.div
//                 key="rated"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex items-center justify-between text-xs"
//               >
//                 <span className="text-gray-500">
//                   <span className="font-semibold text-gray-700">{userRating}</span>/5 verdin
//                 </span>
//                 <span className="text-gray-400 text-[10px]">
//                   {formatNumber(votes)} oy
//                 </span>
//               </motion.div>
//             ) : isVoting ? (
//               <motion.div
//                 key="voting"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex items-center gap-1.5 text-xs text-blue-600"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   ⚡
//                 </motion.div>
//                 Kaydediliyor...
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="prompt"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="flex items-center justify-between text-xs"
//               >
//                 <span className="text-blue-600 font-medium">
//                   Puan ver ⭐
//                 </span>
//                 <span className="text-gray-400 text-[10px]">
//                   {formatNumber(votes)} oy
//                 </span>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>
//     </div>
//   );
// }