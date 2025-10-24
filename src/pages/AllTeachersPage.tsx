import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Star, Search } from 'lucide-react'
import { useTeachers } from "../hooks/useTeachers"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import placeholder from '../../public/placeholder2.png'

const DEFAULT_TEACHER_IMAGE = placeholder;

const AllTeachersPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "en"
  const { data: teachers = [], isLoading, error, refetch } = useTeachers();
  const [search, setSearch] = useState("")
  const location = useLocation();

  // SPA'da route değişiminde tekrar fetch et!
  useEffect(() => {
    refetch();
  }, [location.pathname]);

  // Helper for image fallback
  const getTeacherImage = (teacher: any) => {
    return teacher.image && teacher.image.trim() !== "" ? teacher.image : DEFAULT_TEACHER_IMAGE;
  }

  // Dil bazlı alan seçici
  const getTranslated = (item: any, field: string) => {
    const key = `${field}_${lang}`;
    return item[key] || item[field] || "";
  };

  // Çok dilli başarılar
  const getAchievements = (teacher: any) => {
    const key = `achievements_${lang}`;
    return teacher[key] || teacher.achievements || [];
  };

  // Filtreleme
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
              className="w-full py-3 px-5 rounded-xl border border-blue-200 focus:border-blue-500 outline-none text-lg transition"
              placeholder={t("teachers.search_placeholder") || "Search teachers..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
          </div>
        </div>
        
        {/* All Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTeachers.map((teacher: any, index: number) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              {/* Teacher Image */}
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
                        <span>{teacher.likes.toLocaleString()}</span>
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
          ))}
        </div>
        {/* Eğer hiç öğretmen yoksa */}
        {filteredTeachers.length === 0 && (
          <div className="text-center text-gray-400 text-lg mt-12">{t("teachers.no_results") || "No teachers found."}</div>
        )}
      </div>
    </section>
  )
}

export default AllTeachersPage