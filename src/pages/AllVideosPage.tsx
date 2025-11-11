import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useVideos } from "../hooks/useVideos";
import { useCategories } from "../hooks/useCategories";
import { useTranslation } from "react-i18next";
import { Play, Clock, Eye, X, ChevronDown, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import SmartVideoRatingBar from "../components/SmartVideoRatingBar";

const PAGE_SIZE = 8;

type CategoryType = {
  id: number | string;
  name: string;
  name_tk?: string;
  name_ru?: string;
  name_en?: string;
  image?: string;
  [key: string]: any;
};

type CategoryButtonType = {
  label: string;
  value: number | string;
  image?: string;
};

export default function AllVideosPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "category">("all");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [activeVideo, setActiveVideo] = useState<any>(null); // MODAL için aktif video

  const { data: videos = [], isLoading: videosLoading, refetch } = useVideos();
  const { data: categories = [] } = useCategories();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const location = useLocation();

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  function getCategoryLabel(cat: CategoryType) {
    return (cat as any)[`name_${lang}`] || cat.name;
  }

  const CATEGORIES: CategoryButtonType[] = [
    { label: t("videos.all_categories") || "All Categories", value: "all" },
    ...categories.map(cat => ({
      label: getCategoryLabel(cat),
      value: String(cat.id),
      image: cat.image
    }))
  ];

  let filteredVideos = videos.filter(v => !v.featured);
  if (activeFilter === "category" && category !== "all") {
    filteredVideos = filteredVideos.filter(
      (video: any) => String(video.category) === String(category)
    );
  }
  if (search.trim()) {
    const lcSearch = search.toLowerCase();
    filteredVideos = filteredVideos.filter((video: any) =>
      ((video[`title_${lang}`] || video.title) ?? "").toLowerCase().includes(lcSearch) ||
      ((video[`description_${lang}`] || video.description) ?? "").toLowerCase().includes(lcSearch)
    );
  }

  const totalVideos = filteredVideos.length;
  const totalPages = Math.ceil(totalVideos / PAGE_SIZE);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, category, search]);

  const handleAllClick = () => {
    setActiveFilter("all");
    setCategory("all");
    setShowCategoryDropdown(false);
  };
  const handleCategorySelect = (val: number | string) => {
    setCategory(String(val));
    setActiveFilter("category");
    setShowCategoryDropdown(false);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 mb-2 px-2">
            {t("videos.all_videos")}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t("videos.all_videos_desc")}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <input
            type="text"
            placeholder={t("videos.search_placeholder")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm w-full max-w-md bg-white border-none outline-none shadow focus:ring-2 focus:ring-blue-300 transition"
            style={{
              boxShadow: "0 1px 8px 0 rgba(59,130,246,.08)"
            }}
          />
        </div>

        {/* Filtre Button Alanı */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 relative">
          <button
            onClick={handleAllClick}
            className={`px-4 py-1.5 sm:px-5 sm:py-2 lg:px-6 rounded-full text-xs sm:text-sm font-semibold shadow transition duration-200 border-none outline-none ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                : "bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {t("videos.all")}
          </button>
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
              }}
              className={`px-4 py-1.5 sm:px-5 sm:py-2 lg:px-6 rounded-full text-xs sm:text-sm font-semibold shadow transition duration-200 border-none outline-none flex items-center gap-1.5 sm:gap-2 ${
                activeFilter === "category"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span className="truncate max-w-[100px] sm:max-w-none">
                {category !== "all"
                  ? CATEGORIES.find(cat => String(cat.value) === String(category))?.label || t("videos.category")
                  : t("videos.category") || "Category"}
              </span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute left-0 top-full z-10 mt-2 w-36 sm:w-44 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 py-2 max-h-60 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                      String(category) === String(cat.value)
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <span className="line-clamp-1">{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video grid */}
        {videosLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-blue-600 text-sm sm:text-base lg:text-lg font-semibold">
              {t("videos.loading") || "Loading videos..."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {paginatedVideos.map((video: any, idx: number) => {
              const displayTitle = (video[`title_${lang}`] || video.title) ?? "";
              const displayDescription = (video[`description_${lang}`] || video.description) ?? "";
              const displayInstructor = (video[`instructor_${lang}`] || video.instructor) ?? "";
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
                  }}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <div className="relative h-32 sm:h-36 lg:h-44 overflow-hidden">
                    {video.video_file ? (
                      <video
                        src={video.video_file}
                        poster={video.thumbnail}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-blue-600/90 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow">
                      {video.duration}
                    </div>
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center space-x-1 sm:space-x-2">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span className="text-xs sm:text-sm font-semibold text-white bg-blue-500/60 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">{video.views}</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{displayTitle}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{displayDescription}</p>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 mt-auto">
                      <span className="line-clamp-1">{displayInstructor}</span>
                    </div>
                    {/* ★ Rating Bar (average_rating ve rating_count varsa prop ile!) */}
                    <div className="mt-1 mb-4">
                      <SmartVideoRatingBar
                        videoId={video.id}
                        ratingData={{
                          average_rating: video.average_rating,
                          rating_count: video.rating_count
                        }}
                        compact
                        onRatingSuccess={() => refetch()} 
                      />
                    </div>
                    <button
                      className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-xs sm:text-sm mt-auto"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{t("videos.watch_now")}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {activeVideo && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3 sm:px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 max-w-2xl w-full relative flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-blue-700 bg-white rounded-full p-1"
                aria-label="Close"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="md:w-1/2 w-full flex items-center justify-center">
                {activeVideo.video_file ? (
                  <video
                    src={activeVideo.video_file}
                    controls
                    autoPlay
                    className="w-full h-40 sm:h-48 lg:h-56 object-contain rounded-lg sm:rounded-xl bg-black"
                    poster={activeVideo.thumbnail}
                  />
                ) : (
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo[`title_${lang}`] || activeVideo.title}
                    className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg sm:rounded-xl"
                  />
                )}
              </div>
              <div className="md:w-1/2 w-full flex flex-col">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-blue-700 pr-6">
                  {activeVideo[`title_${lang}`] || activeVideo.title}
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-2">
                  {activeVideo[`description_${lang}`] || activeVideo.description}
                </p>
                {/* Modalda rating bar (average_rating ve rating_count varsa yine prop ile!) */}
                <div className="mt-2 mb-4">
                  <SmartVideoRatingBar
                    videoId={activeVideo.id}
                    ratingData={{
                      average_rating: activeVideo.average_rating,
                      rating_count: activeVideo.rating_count
                    }}
                      onRatingSuccess={() => refetch()}
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm mb-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span>{activeVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span>{activeVideo.views} {t("videos.views")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                    <span>{activeVideo.rating}</span>
                  </div>
                </div>
                <p className="text-blue-600 text-[10px] sm:text-xs lg:text-sm font-semibold line-clamp-1">
                  {activeVideo[`instructor_${lang}`] || activeVideo.instructor}
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
            <nav className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 sm:px-3 text-xs sm:text-sm rounded-lg font-medium border border-blue-300 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-2.5 py-1 sm:px-3 text-xs sm:text-sm rounded-lg font-medium border ${
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
                className="px-2.5 py-1 sm:px-3 text-xs sm:text-sm rounded-lg font-medium border border-blue-300 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
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