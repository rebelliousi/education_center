import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Star, Search, Award, Clock } from 'lucide-react'
import { useTeachers } from "../hooks/useTeachers"
import { useLikeTeacher, useRemoveLikeTeacher } from "../hooks/useLikeTeacher"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import placeholder from '../../public/placeholder2.png'

const DEFAULT_TEACHER_IMAGE = placeholder;

const AllTeachersPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "en"
  const { data: teachers = [], isLoading, error, refetch } = useTeachers();
  const [search, setSearch] = useState("")
  const [likedTeachers, setLikedTeachers] = useState<number[]>([])
  const location = useLocation();

  useEffect(() => {
    refetch();
    const stored = localStorage.getItem("likedTeachers");
    if (stored) {
      setLikedTeachers(JSON.parse(stored));
    }
  }, [location.pathname]);
  
  // BACKEND mutation hooks
  const { mutate: likeTeacher, isPending: likePending } = useLikeTeacher();
  const { mutate: removeLikeTeacher, isPending: removeLikePending } = useRemoveLikeTeacher();

  const getTeacherImage = (teacher: any) => {
    return teacher.image && teacher.image.trim() !== "" ? teacher.image : DEFAULT_TEACHER_IMAGE;
  }
  const getTranslated = (item: any, field: string) => {
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };
  const getAchievements = (teacher: any) => {
    const key = `achievements_${lang}`;
    return teacher[key] || teacher.achievements || [];
  };

  // BACKEND entegre handleLike fonksiyonu
  const handleLike = (teacherId: number) => {
    if (likedTeachers.includes(teacherId)) {
      removeLikeTeacher(teacherId, {
        onSuccess: () => {
          const updated = likedTeachers.filter(id => id !== teacherId);
          setLikedTeachers(updated);
          localStorage.setItem("likedTeachers", JSON.stringify(updated));
          refetch();
        }
      });
    } else {
      likeTeacher(teacherId, {
        onSuccess: () => {
          const updated = [...likedTeachers, teacherId];
          setLikedTeachers(updated);
          localStorage.setItem("likedTeachers", JSON.stringify(updated));
          refetch();
        }
      });
    }
  };

  const filteredTeachers = teachers.filter((teacher: any) => {
    const name = getTranslated(teacher, 'name').toLowerCase();
    const specialization = getTranslated(teacher, 'specialization').toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      specialization.includes(search.toLowerCase())
    )
  });

  return (
    <section id="all-teachers" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">{t("teachers.all_faculty") || "All Teachers"}</span>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("teachers.meet_all") || "Meet All Our Teachers"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("teachers.all_faculty_desc") || "Explore our diverse faculty and find your ideal instructor."}
          </p>
        </motion.div>

        {/* Search bar */}
        <div className="flex items-center justify-center mb-10">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              className="w-full py-3 px-5 rounded-xl border border-blue-200 focus:border-blue-500 outline-none text-lg transition shadow-sm"
              placeholder={t("teachers.search_placeholder") || "Search teachers..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
          </div>
        </div>
        
        {/* Updated Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredTeachers.map((teacher: any, index: number) => {
            const isLiked = likedTeachers.includes(teacher.id);
            
            return (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl cursor-pointer"
              >
                {/* Teacher Image with Overlay */}
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src={getTeacherImage(teacher)}
                    alt={getTranslated(teacher, "name")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
                  
                  {/* Experience Badge */}
                  {teacher.experience && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1"
                    >
                      <Star className="h-3 w-3" />
                      <span>   {t("teacher_experience", { exp: teacher.experience })}</span>
                    </motion.div>
                  )}
                  
                  {/* Like Button (Backend entegreli) */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(teacher.id);
                    }}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isLiked 
                        ? 'bg-red-500 text-white scale-110' 
                        : 'bg-white/30 backdrop-blur-md text-white hover:bg-white/50 border border-white/50'
                    }`}
                    disabled={likePending || removeLikePending}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>

                  {/* Stats Overlay - Bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between text-white text-sm font-semibold">
                        
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-300" />
                          <span>{teacher.likes?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-green-300" />
                          <span>{getAchievements(teacher).length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Content */}
                <div className="p-5 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {getTranslated(teacher, "name")}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm mb-3 line-clamp-1">
                    {getTranslated(teacher, "specialization")}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {getTranslated(teacher, "bio")}
                  </p>
                  
                  {/* Achievements */}
                  {getAchievements(teacher).length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Award className="h-3 w-3" />
                        <span>Achievements:</span>
                      </div>
                      <ul className="text-xs text-blue-600 space-y-1">
                        {getAchievements(teacher).slice(0, 2).map((ach: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 line-clamp-1">
                            <span className="text-yellow-500 mt-0.5">•</span>
                            <span className="flex-1">{ach}</span>
                          </li>
                        ))}
                        {getAchievements(teacher).length > 2 && (
                          <li className="text-gray-500 text-xs">
                            +{getAchievements(teacher).length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 text-lg mt-12 py-12"
          >
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>{t("teachers.no_results") || "No teachers found."}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default AllTeachersPage