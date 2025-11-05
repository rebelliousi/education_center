import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Users,
  BookOpen,
  Award,
  X,
  Clock12,
  ClosedCaptionIcon,
  LucideAlarmClockOff,
  Calendar
} from "lucide-react";
import { useCourses } from "../hooks/useCourses";
import { useLevels } from "../hooks/useLevels";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {SmartRatingBar} from "../components/SmartRatingBar";

function getCardGradient() {
  return "from-blue-200 via-blue-400 to-blue-700";
}

function getLevelColor(level: string) {
  return "bg-blue-100 text-blue-700";
}

function getCategoryCourses(courses: any[], lang: string) {
  const uniqueCourses: any[] = [];
  const seenCategories = new Set();
  for (const course of courses) {
    const category =
      course[`category_${lang}`] ||
      course.category_en ||
      course.category_tk ||
      course.category_ru ||
      course.category ||
      "";
    if (!seenCategories.has(category)) {
      uniqueCourses.push(course);
      seenCategories.add(category);
    }
  }
  return uniqueCourses;
}

export default function CoursesSection() {
  const [filter, setFilter] = useState<string | number>("all");
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: levels = [] } = useLevels();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const navigate = useNavigate();

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

  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((course: any) =>
          typeof course.level === "object" && course.level !== null && "id" in course.level
            ? course.level.id === filter
            : false
        );

  const categoryCourses = getCategoryCourses(filteredCourses, lang);

  return (
    <section id="courses" className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full">
              <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
              <span className="text-sm lg:text-base text-blue-700 font-semibold">{t("courses.curriculum")}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 lg:mb-6 px-2">
            {t("courses.discover")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("courses.diverse")}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            {t("courses.explore_desc")}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="
            flex gap-2 mb-8 lg:mb-0 overflow-x-auto scrollbar-hide
            snap-x snap-mandatory pb-2 pt-1 -mx-3 px-3 relative
            before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-6 before:pointer-events-none before:bg-gradient-to-r before:from-white before:to-transparent
            after:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-6 after:pointer-events-none after:bg-gradient-to-l after:from-white after:to-transparent
            lg:hidden
          "
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              onClick={() => setFilter(lvl.value)}
              className={`
                flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 border
                ${filter === lvl.value
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
                snap-center
              `}
              aria-pressed={filter === lvl.value}
            >
              {lvl.label}
            </button>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="hidden lg:flex flex-wrap justify-center gap-3 mb-12"
        >
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              onClick={() => setFilter(lvl.value)}
              className={`
                px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border
                ${filter === lvl.value
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
              `}
              aria-pressed={filter === lvl.value}
            >
              {lvl.label}
            </button>
          ))}
        </motion.div>

        {/* Course Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
          {categoryCourses.map((course: any, index: number) => {
            const displayName = course[`name_${lang}`] || course.name;
            const displayDescription = course[`description_${lang}`] || course.description;
            const displayDuration = course[`duration_${lang}`] || course.duration;
            let displayLevel = "";
            if (typeof course.level === "object" && course.level !== null) {
              displayLevel = course.level[`name_${lang}`] || course.level.name || "";
            } else {
              displayLevel = course.level;
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
                className="bg-white rounded-xl lg:rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-xl flex flex-col"
                tabIndex={0}
                role="button"
                aria-label={t("courses.learn_more", { name: displayName })}
              >
                {/* Course Image */}
                <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${getCardGradient()} opacity-70`} />
                  <div className="absolute top-2 left-2 lg:top-4 lg:left-4">
                    <span className={`px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-[10px] lg:text-xs font-semibold ${getLevelColor(displayLevel)}`}>
                      {displayLevel}
                    </span>
                  </div>
                  {/* GERÇEK RATING BAR - KARTTA INTERAKTIF MAVİ STAR BAR */}
                  <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 flex items-center">
                    <SmartRatingBar
                      courseId={course.id}

                      compact
                    />
                  </div>
                </div>
                {/* Course Content */}
                <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-6">
                  <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 min-h-[36px] sm:min-h-[44px] lg:min-h-[56px]">
                    {displayName}
                  </h3>
                  {/* Sadece 2 satırda description görünür */}
                  <p className="text-xs sm:text-sm text-gray-600 font-normal line-clamp-2 mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                    {displayDescription}
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs lg:text-sm text-gray-500 mb-2 sm:mb-3 lg:mb-4">
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
                      <span className="truncate">{displayDuration}</span>
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
                      <span>{course.hours} {t("courses.hours")}</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button
                      className="w-full flex items-center justify-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-800 font-semibold text-xs sm:text-sm"
                      onClick={() => setActiveCourse(course)}
                    >
                      <span>{t("courses.learn_more_btn")}</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal */}
        {activeCourse && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setActiveCourse(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-700"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <img src={activeCourse.image} alt={activeCourse.name} className="w-full h-48 object-cover rounded-xl mb-6" />
              <h2 className="text-2xl font-bold mb-4">{activeCourse[`name_${lang}`] || activeCourse.name}</h2>
              {/* Modalda tüm description tam olarak görünür! */}
              <p className="text-gray-700 text-base mb-4">
                {activeCourse[`description_${lang}`] || activeCourse.description}
              </p>
              <div className="font-bold text-blue-700 text-xl mb-2">
                {t("courses.price")}: {activeCourse.price} TMT
              </div>
              {/* Modalda rating bar YOK */}
            </motion.div>
          </div>
        )}

        {/* Call to Action - Responsive & Mobile Friendly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14 lg:mt-16"
        >
          <div className="bg-blue-600 text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl">
            <Award className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">{t("courses.ready")}</h3>
            <p className="text-xs sm:text-base lg:text-lg text-blue-100 mb-4 sm:mb-6">{t("courses.join_students")}</p>
            <button
              className="w-full sm:w-auto px-4 py-2 sm:px-8 sm:py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-lg"
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