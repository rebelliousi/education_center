import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, BookOpen, Award } from "lucide-react";
import { useCourses } from "../hooks/useCourses";
import { useLevels } from "../hooks/useLevels";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner":
    case "Başlangyç":
    case "Новичок":
      return "bg-green-100 text-green-700";
    case "Intermediate":
    case "Orta":
    case "Средний":
      return "bg-yellow-100 text-yellow-700";
    case "Advanced":
    case "Ýokary":
    case "Продвинутый":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
}

export default function CoursesSection() {
  const [filter, setFilter] = useState<string | number>("all");
  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: levels = [], isLoading: levelsLoading, error: levelsError } = useLevels();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  // Sadece kursu olan seviyelerin id'lerini bul (TypeScript hatasız)
  const usedLevelIds = new Set(
    courses
      .map(course =>
        typeof course.level === "object" && course.level !== null && "id" in course.level
          ? (course.level as any).id
          : undefined
      )
      .filter((id): id is number => typeof id === "number")
  );

  const LEVELS = [
    { label: t("courses.all"), value: "all" },
    ...levels
      .filter((lvl: any) => usedLevelIds.has(lvl.id))
      .map((lvl: any) => ({
        label: lvl[`name_${lang}`] || lvl.name,
        value: lvl.id
      }))
  ];

  // Seçili filtreye göre kursları göster
  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((course: any) =>
          typeof course.level === "object" && course.level !== null && "id" in course.level
            ? course.level.id === filter
            : false
        );

  return (
    <section id="courses" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">{t("courses.curriculum")}</span>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("courses.discover")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("courses.diverse")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("courses.explore_desc")}
          </p>
        </motion.div>

        {/* Level Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              onClick={() => setFilter(lvl.value)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border ${
                filter === lvl.value
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
              }`}
              aria-pressed={filter === lvl.value}
            >
              {lvl.label}
            </button>
          ))}
        </motion.div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course: any, index: number) => {
            // Dil desteğiyle kurs alanlarını göster
            const displayName = course[`name_${lang}`] || course.name;
            const displayDescription = course[`description_${lang}`] || course.description;
            const displayDuration = course[`duration_${lang}`] || course.duration;

            // Level adı
            let displayLevel = "";
            if (typeof course.level === "object" && course.level !== null) {
              displayLevel = course.level[`name_${lang}`] || course.level.name || "";
            }

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
                }}
                className="bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl flex flex-col"
                tabIndex={0}
                role="button"
                aria-label={t("courses.learn_more", { name: displayName })}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-70`} />
                  <div className="absolute top-4 right-4 text-3xl drop-shadow-lg">{course.icon}</div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(displayLevel)}`}>
                      {displayLevel}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-white">{course.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight min-h-[56px]">
                    {displayName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[48px]">
                    {displayDescription}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{displayDuration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{course.students}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-800 font-semibold">
                      <span>{t("courses.learn_more_btn")}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl">
            <Award className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t("courses.ready")}</h3>
            <p className="text-blue-100 mb-6">{t("courses.join_students")}</p>
            <button
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/courses")}
            >
              {t("courses.view_all")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}