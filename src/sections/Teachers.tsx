import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Award, Users, Star, Trophy } from 'lucide-react'
import { useTeachers } from "../hooks/useTeachers"
import { useLikeTeacher } from "../hooks/useLikeTeacher"
import { useTranslation } from "react-i18next"

const Teachers = () => {
  const [likedTeachers, setLikedTeachers] = useState<number[]>([])
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "en" // default en

  // Dinamik olarak öğretmenleri çek
  const { data: teachers = [], isLoading, error } = useTeachers();

  // Like mutation hook
  const { mutate: likeTeacher, isPending: likePending } = useLikeTeacher();

  // Dil bazlı alan seçici
  const getTranslated = (item: any, field: string) => {
    const key = `${field}_${lang}`;
    return item[key] || item[field] || ""; // Dil yoksa fallback
  };

  // Achievements çok dilli
  const getAchievements = (teacher: any) => {
    const key = `achievements_${lang}`;
    return teacher[key] || teacher.achievements || [];
  };

  const handleLike = (teacherId: number, currentLikes: number) => {
    likeTeacher(teacherId); // Backend'e gönder
    if (likedTeachers.includes(teacherId)) {
      setLikedTeachers(likedTeachers.filter(id => id !== teacherId))
    } else {
      setLikedTeachers([...likedTeachers, teacherId])
    }
  }

  const sortedTeachers = [...teachers].sort((a, b) => {
    const aLikes = likedTeachers.includes(a.id) ? a.likes + 1 : a.likes
    const bLikes = likedTeachers.includes(b.id) ? b.likes + 1 : b.likes
    return bLikes - aLikes
  })

  const topTeachers = sortedTeachers.slice(0, 3)

  return (
    <section id="teachers" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">{t("teachers.meet_faculty")}</span>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("teachers.world_class")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("teachers.educators")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("teachers.description")}
          </p>
        </motion.div>

        {/* Top Teachers Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 mb-20 text-white shadow-xl"
        >
          <div className="text-center mb-10">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold">{t("teachers.top_rated")}</h3>
            <p className="text-blue-100 text-lg mt-2">{t("teachers.most_appreciated")}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {topTeachers.map((teacher, index) => {
              const currentLikes = likedTeachers.includes(teacher.id) ? teacher.likes + 1 : teacher.likes
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative mb-6">
                    <img
                      src={teacher.image}
                      alt={getTranslated(teacher, "name")}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/40 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="font-bold text-xl mb-2">{getTranslated(teacher, "name")}</h4>
                  <p className="text-blue-100 text-sm mb-4">{getTranslated(teacher, "specialization")}</p>
                  <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-full py-2 px-4 w-fit mx-auto">
                    <Heart className="h-5 w-5 text-red-300" />
                    <span className="font-bold text-lg">{currentLikes.toLocaleString()}</span>
                  </div>
                  <div className="mt-4">
                    {getAchievements(teacher).length > 0 && (
                      <ul className="text-xs text-blue-100">
                        {getAchievements(teacher).map((ach: string, idx: number) => (
                          <li key={idx}>🏅 {ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* All Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedTeachers.map((teacher, index) => {
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
                {/* Teacher Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src={teacher.image}
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
                  
                  {/* Like Button */}
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

                  {/* Stats Overlay */}
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

                {/* Teacher Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {getTranslated(teacher, "name")}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm">
                    {getTranslated(teacher, "specialization")}
                  </p>
                  <p className="text-gray-700 text-sm mt-2">{getTranslated(teacher, "bio")}</p>
                  {getAchievements(teacher).length > 0 && (
                    <ul className="text-xs text-blue-600 mt-2">
                      {getAchievements(teacher).map((ach: string, idx: number) => (
                        <li key={idx}>🏅 {ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-12 rounded-3xl shadow-xl border border-blue-500/30">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-3">{t("teachers.join_team")}</h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">{t("teachers.join_team_desc")}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-blue-600 font-bold rounded-full hover:shadow-xl transition-all duration-300 text-lg"
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