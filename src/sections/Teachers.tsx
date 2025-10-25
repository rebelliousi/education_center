import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Award, Users, Star, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTeachers } from "../hooks/useTeachers"
import { useLikeTeacher } from "../hooks/useLikeTeacher"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import placeholder from '../../public/placeholder2.png'

// Default teacher image path
const DEFAULT_TEACHER_IMAGE = placeholder;

const Teachers = () => {
  const [likedTeachers, setLikedTeachers] = useState<number[]>([])
  const [topSliderIndex, setTopSliderIndex] = useState(0)
  const [gridSliderIndex, setGridSliderIndex] = useState(0)

  const { t, i18n } = useTranslation()
  const lang = i18n.language || "en"
  const navigate = useNavigate();

  const { data: teachers = [], isLoading, error } = useTeachers();
  const { mutate: likeTeacher, isPending: likePending } = useLikeTeacher();

  const getTranslated = (item: any, field: string) => {
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };
  const getAchievements = (teacher: any) => {
    const key = `achievements_${lang}`;
    return teacher[key] || teacher.achievements || [];
  };

  const handleLike = (teacherId: number, currentLikes: number) => {
    likeTeacher(teacherId);
    if (likedTeachers.includes(teacherId)) {
      setLikedTeachers(likedTeachers.filter(id => id !== teacherId))
    } else {
      setLikedTeachers([...likedTeachers, teacherId])
    }
  }

  // Sıralama ve slice'lar
  const sortedTeachers = [...teachers].sort((a, b) => {
    const aLikes = likedTeachers.includes(a.id) ? a.likes + 1 : a.likes
    const bLikes = likedTeachers.includes(b.id) ? b.likes + 1 : b.likes
    return bLikes - aLikes
  })
  const top3Teachers = sortedTeachers.slice(0, 3)
  const top8Teachers = sortedTeachers.slice(0, 8)

  // Helper for image fallback
  const getTeacherImage = (teacher: any) => {
    return teacher.image && teacher.image.trim() !== "" ? teacher.image : DEFAULT_TEACHER_IMAGE;
  }

  // Slider navigation handlers
  const handleTopPrev = () => {
    setTopSliderIndex((prev) => (prev === 0 ? top3Teachers.length - 1 : prev - 1))
  }
  const handleTopNext = () => {
    setTopSliderIndex((prev) => (prev === top3Teachers.length - 1 ? 0 : prev + 1))
  }

  const handleGridPrev = () => {
    setGridSliderIndex((prev) => (prev === 0 ? top8Teachers.length - 1 : prev - 1))
  }
  const handleGridNext = () => {
    setGridSliderIndex((prev) => (prev === top8Teachers.length - 1 ? 0 : prev + 1))
  }

  // Auto-advance top teachers slider every 4 seconds (mobile only)
  useEffect(() => {
    const timer = setInterval(() => {
      if (window.innerWidth < 768) { // md breakpoint
        handleTopNext()
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [topSliderIndex, top3Teachers.length])

  // Auto-advance grid slider every 4 seconds (lg: 1024 ve altı)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      const timer = setInterval(() => {
        setGridSliderIndex((prev) => (prev === top8Teachers.length - 1 ? 0 : prev + 1))
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [gridSliderIndex, top8Teachers.length])

  return (
    <section id="teachers" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm sm:text-base">{t("teachers.meet_faculty")}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-2">
            {t("teachers.world_class")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("teachers.educators")}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {t("teachers.description")}
          </p>
        </motion.div>

        {/* Top Teachers Leaderboard with Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-10 sm:mb-16 lg:mb-20 text-white shadow-xl relative"
        >
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <Trophy className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 text-yellow-300" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t("teachers.top_rated")}</h3>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">{t("teachers.most_appreciated")}</p>
          </div>
          {/* Mobile: Slider, Desktop: Grid */}
          <div className="relative">
            {/* Mobile Slider */}
            <div className="block md:hidden">
              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: `-${topSliderIndex * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex"
                >
                  {top3Teachers.map((teacher, index) => {
                    const currentLikes = likedTeachers.includes(teacher.id) ? teacher.likes + 1 : teacher.likes
                    return (
                      <div key={teacher.id} className="w-full flex-shrink-0 px-2">
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
                          <div className="relative mb-4 inline-block">
                            <img
                              src={getTeacherImage(teacher)}
                              alt={getTranslated(teacher, "name")}
                              className="w-16 h-16 rounded-full object-cover border-4 border-white/40"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                          <h4 className="font-bold text-base mb-1 line-clamp-1">{getTranslated(teacher, "name")}</h4>
                          <p className="text-blue-100 text-xs mb-3 line-clamp-1">{getTranslated(teacher, "specialization")}</p>
                          <div className="flex items-center justify-center space-x-1.5 bg-white/10 rounded-full py-1.5 px-3 w-fit mx-auto">
                            <Heart className="h-4 w-4 text-red-300" />
                            <span className="font-bold text-base">{currentLikes.toLocaleString()}</span>
                          </div>
                          {getAchievements(teacher).length > 0 && (
                            <ul className="text-[10px] text-blue-100 space-y-0.5 mt-3">
                              {getAchievements(teacher).slice(0, 2).map((ach: string, idx: number) => (
                                <li key={idx} className="line-clamp-1">🏅 {ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
                {/* Slider Arrows - üstünde ve ortada */}
                <button
                  onClick={handleTopPrev}
                  className="absolute top-[38%] -translate-y-1/2 left-3 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleTopNext}
                  className="absolute top-[38%] -translate-y-1/2 right-3 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {top3Teachers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTopSliderIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === topSliderIndex ? 'bg-white w-6' : 'bg-white/40 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
              {top3Teachers.map((teacher, index) => {
                const currentLikes = likedTeachers.includes(teacher.id) ? teacher.likes + 1 : teacher.likes
                return (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/15 backdrop-blur-md rounded-2xl p-6 lg:p-8 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative mb-6">
                      <img
                        src={getTeacherImage(teacher)}
                        alt={getTranslated(teacher, "name")}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/40 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg lg:text-xl mb-2">{getTranslated(teacher, "name")}</h4>
                    <p className="text-blue-100 text-sm mb-4 line-clamp-1">{getTranslated(teacher, "specialization")}</p>
                    <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-full py-2 px-4 w-fit mx-auto">
                      <Heart className="h-5 w-5 text-red-300" />
                      <span className="font-bold text-lg">{currentLikes.toLocaleString()}</span>
                    </div>
                    {getAchievements(teacher).length > 0 && (
                      <ul className="text-xs text-blue-100 space-y-0.5 mt-4">
                        {getAchievements(teacher).slice(0, 2).map((ach: string, idx: number) => (
                          <li key={idx} className="line-clamp-1">🏅 {ach}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* All Teachers Grid with Slider */}
        <div className="relative">
          {/* Mobile Slider */}
          <div className="block lg:hidden relative my-8">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${gridSliderIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
              >
                {top8Teachers.map((teacher) => {
                  const isLiked = likedTeachers.includes(teacher.id)
                  const currentLikes = isLiked ? teacher.likes + 1 : teacher.likes
                  return (
                    <div key={teacher.id} className="w-full flex-shrink-0 px-2">
                      <div className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-200/50 shadow-lg">
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                          <img
                            src={getTeacherImage(teacher)}
                            alt={getTranslated(teacher, "name")}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
                          {teacher.featured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">
                              ⭐ {t("teachers.featured")}
                            </div>
                          )}
                          <button
                            onClick={() => handleLike(teacher.id, teacher.likes)}
                            disabled={likePending}
                            className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                              isLiked 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/30 backdrop-blur-md text-white border border-white/50'
                            }`}
                          >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 border border-white/30">
                              <div className="flex items-center justify-between text-white text-xs font-semibold">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-300 fill-current" />
                                  <span>{teacher.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-3 w-3 text-red-300" />
                                  <span>{currentLikes.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                            {getTranslated(teacher, "name")}
                          </h3>
                          <p className="text-blue-600 font-semibold text-xs line-clamp-1">
                            {getTranslated(teacher, "specialization")}
                          </p>
                          <p className="text-gray-700 text-xs mt-1.5 line-clamp-2">{getTranslated(teacher, "bio")}</p>
                          {getAchievements(teacher).length > 0 && (
                            <ul className="text-[10px] text-blue-600 mt-1.5 space-y-0.5">
                              {getAchievements(teacher).slice(0, 2).map((ach: string, idx: number) => (
                                <li key={idx} className="line-clamp-1">🏅 {ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
              {/* Slider Arrows - üstünde ve ortada */}
              {/* <button
                onClick={handleGridPrev}
                className="absolute top-[38%] -translate-y-1/2 left-3 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button> */}
              {/* <button
                onClick={handleGridNext}
                className="absolute top-[38%] -translate-y-1/2 right-3 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button> */}
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {top8Teachers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setGridSliderIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === gridSliderIndex ? 'bg-blue-600 w-6' : 'bg-blue-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {top8Teachers.map((teacher, index) => {
              const isLiked = likedTeachers.includes(teacher.id)
              const currentLikes = isLiked ? teacher.likes + 1 : teacher.likes
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                    <img
                      src={getTeacherImage(teacher)}
                      alt={getTranslated(teacher, "name")}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
                    {teacher.featured && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                      >
                        ⭐ {t("teachers.featured")}
                      </motion.div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleLike(teacher.id, teacher.likes)}
                      disabled={likePending}
                      className={`absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                        isLiked 
                          ? 'bg-red-500 text-white scale-110' 
                          : 'bg-white/30 backdrop-blur-md text-white hover:bg-white/50 border border-white/50'
                      }`}
                    >
                      <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                        <div className="flex items-center justify-between text-white text-sm font-semibold">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-300 fill-current" />
                            <span>{teacher.rating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-300" />
                            <span>{currentLikes.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {getTranslated(teacher, "name")}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm line-clamp-1">
                      {getTranslated(teacher, "specialization")}
                    </p>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">{getTranslated(teacher, "bio")}</p>
                    {getAchievements(teacher).length > 0 && (
                      <ul className="text-xs text-blue-600 mt-2 space-y-0.5">
                        {getAchievements(teacher).slice(0, 2).map((ach: string, idx: number) => (
                          <li key={idx} className="line-clamp-1">🏅 {ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-500/30">
            <Award className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{t("teachers.join_team")}</h3>
            <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">{t("teachers.join_team_desc")}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 sm:px-8 sm:py-3 lg:px-10 lg:py-4 bg-white text-blue-600 font-bold rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg"
              onClick={() => navigate("/teachers")}
            >
              {t("teachers.apply_to_teach")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Teachers