import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useCourses } from "../hooks/useCourses";
import { useLevels } from "../hooks/useLevels";
import { useCategories } from "../hooks/useCategories";
import { useTranslation } from "react-i18next";
import { Clock, Users, Star, ChevronDown, X } from "lucide-react";
import { useLocation } from "react-router-dom";

// Seviye rengi fonksiyonu
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

type CategoryButtonType = {
  label: string;
  value: number | string;
  image?: string;
};

const PAGE_SIZE = 8;

export default function AllCoursesPage() {
  // SPA navigasyonunda da veri gelsin diye refetch eklenir!
  const { refetch, data: courses = [], isLoading: coursesLoading } = useCourses();
  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const [activeFilter, setActiveFilter] = useState<"all" | "category" | "level">("all");
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<number | string>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [activeCourse, setActiveCourse] = useState<any>(null); // MODAL için aktif kurs

  const { data: levels = [] } = useLevels();
  const { data: categories = [] } = useCategories();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // Sadece kursu olan seviyeler için filter
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
    { label: t("courses.all_levels") || "All Levels", value: "all" },
    ...levels
      .filter(lvl => usedLevelIds.has(lvl.id))
      .map(lvl => ({
        label: lvl[`name_${lang}`] || lvl.name || String(lvl.id),
        value: lvl.id
      }))
  ];

  const CATEGORIES: CategoryButtonType[] = [
    { label: t("courses.all_categories") || "All Categories", value: "all" },
    ...categories.map(cat => ({
      label: cat.name,
      value: String(cat.id),
      image: cat.image
    }))
  ];

  // Kursları filtrele
  let filteredCourses = courses;
  if (activeFilter === "category" && category !== "all") {
    filteredCourses = filteredCourses.filter((course: any) =>
      String(course.category) === String(category)
    );
  }
  if (activeFilter === "level" && level !== "all") {
    filteredCourses = filteredCourses.filter((course: any) =>
      course.level?.id === level
    );
  }
  if (search.trim()) {
    const lcSearch = search.toLowerCase();
    filteredCourses = filteredCourses.filter((course: any) =>
      ((course[`name_${lang}`] || course.name) ?? "").toLowerCase().includes(lcSearch) ||
      ((course[`description_${lang}`] || course.description) ?? "").toLowerCase().includes(lcSearch)
    );
  }

  // Pagination hesaplama
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / PAGE_SIZE);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Dropdown state ve ref
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        levelRef.current &&
        !levelRef.current.contains(event.target as Node)
      ) {
        setShowLevelDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, category, level, search]);

  const handleAllClick = () => {
    setActiveFilter("all");
    setCategory("all");
    setLevel("all");
    setShowCategoryDropdown(false);
    setShowLevelDropdown(false);
  };
  const handleCategorySelect = (val: number | string) => {
    setCategory(String(val));
    setActiveFilter("category");
    setShowCategoryDropdown(false);
    setLevel("all");
  };
  const handleLevelSelect = (val: number | string) => {
    setLevel(val);
    setActiveFilter("level");
    setShowLevelDropdown(false);
    setCategory("all");
  };

  return (
    <section className="py-24 min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
            {t("courses.all_courses")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("courses.all_courses_desc")}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder={t("courses.search_placeholder")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full text-sm w-full max-w-md bg-white border-none outline-none shadow focus:ring-2 focus:ring-blue-300 transition"
            style={{
              boxShadow: "0 1px 8px 0 rgba(59,130,246,.08)"
            }}
          />
        </div>

        {/* Filtre Button Alanı */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 relative">
          {/* All Button */}
          <button
            onClick={handleAllClick}
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition duration-200 border-none outline-none ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                : "bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {t("courses.all")}
          </button>

          {/* Category Button & Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowLevelDropdown(false);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition duration-200 border-none outline-none flex items-center gap-2 ${
                activeFilter === "category"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span>
                {category !== "all"
                  ? CATEGORIES.find(cat => String(cat.value) === String(category))?.label || t("courses.category")
                  : t("courses.category") || "Category"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {/* Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-blue-100 py-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                      String(category) === String(cat.value)
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level Button & Dropdown (sadece kursu olan seviyeler!) */}
          <div className="relative" ref={levelRef}>
            <button
              onClick={() => {
                setShowLevelDropdown(!showLevelDropdown);
                setShowCategoryDropdown(false);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition duration-200 border-none outline-none flex items-center gap-2 ${
                activeFilter === "level"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span>
                {level !== "all"
                  ? LEVELS.find(lvl => String(lvl.value) === String(level))?.label
                  : t("courses.level") || "Level"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {/* Dropdown */}
            {showLevelDropdown && (
              <div className="absolute left-0 top-full z-10 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-blue-100 py-2">
                {LEVELS.map(lvl => (
                  <button
                    key={lvl.value}
                    onClick={() => handleLevelSelect(lvl.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                      String(level) === String(lvl.value)
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kurs grid */}
        {coursesLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-blue-600 text-lg font-semibold">
              {t("courses.loading") || "Loading courses..."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedCourses.map((course: any, idx: number) => {
              const displayName = (course[`name_${lang}`] || course.name) ?? "";
              const displayDescription = (course[`description_${lang}`] || course.description) ?? "";
              const displayDuration = (course[`duration_${lang}`] || course.duration) ?? "";
              let displayLevel = "";
              if (typeof course.level === "object" && course.level !== null) {
                displayLevel = (course.level[`name_${lang}`] || course.level.name) ?? "";
              }
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(displayLevel)}`}>
                        {displayLevel}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-white bg-blue-500/60 px-2 py-1 rounded">{course.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{displayName}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{displayDescription}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{displayDuration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{course.students}</span>
                      </div>
                    </div>
                    <button
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold mt-auto"
                      onClick={() => setActiveCourse(course)}
                    >
                      {t("courses.learn_more_btn")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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
              <p className="text-gray-700 text-base mb-4">{activeCourse[`description_${lang}`] || activeCourse.description}</p>
              <div className="font-bold text-blue-700 text-xl mb-2">
                {t("courses.price")}{activeCourse.price ? `: ${activeCourse.price} TMT` : ""}
              </div>
            </motion.div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg font-medium border border-blue-300 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-lg font-medium border ${
                    currentPage === idx + 1
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-300 bg-white hover:bg-blue-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg font-medium border border-blue-300 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {">"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}