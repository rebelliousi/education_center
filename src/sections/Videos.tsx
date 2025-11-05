import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVideos } from "../hooks/useVideos";
import { useViewVideo } from "../hooks/useViewVideo";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SmartVideoRatingBar } from '../components/SmartVideoRatingBar';

const Videos = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "tk";
  const navigate = useNavigate();

  const { data: videos = [], isLoading, error, refetch } = useVideos();
  const { mutate: viewVideo, isPending } = useViewVideo();

  const [modalVideo, setModalVideo] = useState<any>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [gridIndex, setGridIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePlayVideo = (videoId: string | number) => {
    const strId = String(videoId);
    let viewedVideos = JSON.parse(localStorage.getItem("viewedVideos") || "[]");
    viewedVideos = viewedVideos.map((v: any) => String(v));

    if (!viewedVideos.includes(strId)) {
      viewVideo(videoId, {
        onSuccess: () => {
          refetch();
          localStorage.setItem("viewedVideos", JSON.stringify([...viewedVideos, strId]));
        }
      });
    }
  };

  const promotionalVideo = videos.find(v => v.featured) || videos[0];
  const sortedVideos = [...videos]
    .filter(video => !video.featured)
    .sort((a, b) => (b.created || b.id) - (a.created || a.id))
    .slice(0, 12);

  // ⭐ Desktop grid için - her seferinde 4 video göster
  const videosPerPage = 4;
  const totalGridPages = Math.ceil(sortedVideos.length / videosPerPage);
  
  // ⭐ Görünür videolar (grid için)
  const visibleGridVideos = sortedVideos.slice(
    gridIndex * videosPerPage,
    (gridIndex + 1) * videosPerPage
  );

  // ⭐ Mobil slider için - her seferinde 1 video göster (mevcut mantık)
  const sliderVideos = isMobile ? sortedVideos : [];
  
  // ⭐ OTOMATIK KAYMA - Mobil Slider (tekli kayma)
  useEffect(() => {
    if (!isMobile || isPaused || modalVideo || sliderVideos.length <= 1) return;

    const interval = setInterval(() => {
      setSliderIndex(i => (i + 1) % sliderVideos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, isPaused, modalVideo, sliderVideos.length, sliderIndex]);

  // ⭐ Desktop Grid için navigation fonksiyonları
  const nextGrid = () => {
    setGridIndex(i => (i + 1) % totalGridPages);
    setIsPaused(false);
  };

  const prevGrid = () => {
    setGridIndex(i => (i - 1 + totalGridPages) % totalGridPages);
    setIsPaused(false);
  };

  // ⭐ Mobil Slider için navigation fonksiyonları
  const nextSlide = () => {
    setSliderIndex(i => (i + 1) % sliderVideos.length);
    setIsPaused(false);
  };

  const prevSlide = () => {
    setSliderIndex(i => (i - 1 + sliderVideos.length) % sliderVideos.length);
    setIsPaused(false);
  };

  useEffect(() => {
    if (modalVideo) {
      handlePlayVideo(modalVideo.id);
    }
  }, [modalVideo]);

  // ⭐ Rating bar'a tıklama olayını durduran fonksiyon
  const handleRatingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <section id="videos" className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-blue-700 mb-3 sm:mb-4 lg:mb-6 px-2">
            {t("videos.featured_section_title") || "Merkezimiz hakynda"}
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("videos.description")}
          </p>
        </motion.div>

        {/* Featured Video */}
        {promotionalVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                <div className="relative h-48 sm:h-56 lg:h-80 overflow-hidden">
                  {!isMobile || !promotionalVideo.video_file ? (
                    !isMobile ? (
                      <>
                        <img
                          src={promotionalVideo.thumbnail}
                          alt={promotionalVideo[`title_${lang}`] || promotionalVideo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-blue-600/60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 hover:bg-white/30 transition-all duration-300 shadow-md"
                            onClick={() => {
                              handlePlayVideo(promotionalVideo.id);
                              setModalVideo(promotionalVideo);
                            }}
                            disabled={isPending}
                          >
                            <Play className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white ml-1" fill="currentColor" />
                          </motion.button>
                        </div>
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-blue-600/90 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold shadow">
                          {t("videos.featured")}
                        </div>
                      </>
                    ) : (
                      <img
                        src={promotionalVideo.thumbnail}
                        alt={promotionalVideo[`title_${lang}`] || promotionalVideo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <video
                      src={promotionalVideo.video_file}
                      controls
                      className="w-full h-full object-cover rounded-xl"
                      poster={promotionalVideo.thumbnail}
                    />
                  )}
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                    {promotionalVideo[`title_${lang}`] || promotionalVideo.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-base lg:text-lg mb-4 sm:mb-5 lg:mb-6 line-clamp-3">
                    {promotionalVideo[`description_${lang}`] || promotionalVideo.description}
                  </p>
                  <div className="flex items-center space-x-4 sm:space-x-6 mb-3 sm:mb-5 lg:mb-6">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-blue-600 font-semibold text-xs sm:text-base">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      <span>{promotionalVideo.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-blue-600 font-semibold text-xs sm:text-base">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      <span>{promotionalVideo.views} {t("videos.views")}</span>
                    </div>
                    {/* YENİ: Smart Rating Bar - click event durduruldu */}
                    <div onClick={handleRatingClick}>
                      <SmartVideoRatingBar videoId={promotionalVideo.id} compact={true} />
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold text-xs sm:text-base"
                    onClick={() => {
                      handlePlayVideo(promotionalVideo.id);
                      setModalVideo(promotionalVideo);
                    }}>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{t("videos.watch_now")}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 mb-2 sm:mb-3 lg:mb-4 px-2">
            {t("videos.educational_grid_title") || "Egitici wideolar"}
          </h3>
        </motion.div>

        {/* Educational Videos Slider (mobile only) */}
        <div 
          className="block sm:hidden relative my-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={sliderIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeInOut" 
                }}
                className="w-full px-2"
              >
                {sliderVideos[sliderIndex] && (
                  <div
                    className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-blue-100 shadow-md cursor-pointer"
                    onClick={() => setModalVideo(sliderVideos[sliderIndex])}
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      {sliderVideos[sliderIndex].video_file ? (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster={sliderVideos[sliderIndex].thumbnail}
                        >
                          <source src={sliderVideos[sliderIndex].video_file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={sliderVideos[sliderIndex].thumbnail}
                          alt={sliderVideos[sliderIndex][`title_${lang}`] || sliderVideos[sliderIndex].title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                      <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white px-2 py-1 rounded text-xs font-semibold shadow">
                        {sliderVideos[sliderIndex].duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                        {sliderVideos[sliderIndex][`title_${lang}`] || sliderVideos[sliderIndex].title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {sliderVideos[sliderIndex][`description_${lang}`] || sliderVideos[sliderIndex].description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-blue-600" />
                            <span>{sliderVideos[sliderIndex].views}</span>
                          </div>
                          {/* YENİ: Smart Rating Bar - click event durduruldu */}
                          <div onClick={handleRatingClick}>
                            <SmartVideoRatingBar videoId={sliderVideos[sliderIndex].id} compact={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons - Mobile */}
          <button
            onClick={prevSlide}
            className="absolute top-[38%] -translate-y-1/2 left-3 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
            disabled={sliderVideos.length <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-[38%] -translate-y-1/2 right-3 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
            disabled={sliderVideos.length <= 1}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators - Mobile */}
          <div className="flex justify-center gap-2 mt-4">
            {sliderVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSliderIndex(idx);
                  setIsPaused(false);
                }}
                className={`h-2 rounded-full transition-all ${idx === sliderIndex ? 'bg-blue-600 w-6' : 'bg-blue-300 w-2'}`}
              />
            ))}
          </div>
        </div>

        {/* Video Grid (desktop/tablet) - 4'LÜ GRUP KAYMASI */}
        <div 
          className="hidden sm:block relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`grid-${gridIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
            >
              {visibleGridVideos.map((video, idx) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-lg"
                  onClick={() => setModalVideo(video)}
                >
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    {video.video_file ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={video.thumbnail}
                      >
                        <source src={video.video_file} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={video.thumbnail}
                        alt={video[`title_${lang}`] || video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-white/25 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 shadow-md"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVideo(video.id);
                          setModalVideo(video);
                        }}
                      >
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white ml-1" fill="currentColor" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold shadow">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {video[`title_${lang}`] || video.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-1.5 sm:mb-2 line-clamp-2">
                      {video[`description_${lang}`] || video.description}
                    </p>
                    <p className="text-blue-600 text-[10px] sm:text-xs mb-2 sm:mb-3 font-semibold">
                      {video[`instructor_${lang}`] || video.instructor}
                    </p>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-700">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-blue-600" />
                          <span>{video.views}</span>
                        </div>
                        {/* YENİ: Smart Rating Bar - click event durduruldu */}
                        <div onClick={handleRatingClick}>
                          <SmartVideoRatingBar videoId={video.id} compact={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Desktop Grid */}
          <button
            onClick={prevGrid}
            className="absolute top-1/2 -translate-y-1/2 -left-6 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg hover:scale-110"
            disabled={sortedVideos.length <= videosPerPage}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextGrid}
            className="absolute top-1/2 -translate-y-1/2 -right-6 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg hover:scale-110"
            disabled={sortedVideos.length <= videosPerPage}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators - Desktop Grid */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalGridPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setGridIndex(idx);
                  setIsPaused(false);
                }}
                className={`h-2 rounded-full transition-all ${idx === gridIndex ? 'bg-blue-600 w-8' : 'bg-blue-300 w-2'}`}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {modalVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              onClick={() => setModalVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col sm:flex-row items-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-blue-700 z-10 bg-white rounded-full p-1"
                  onClick={() => setModalVideo(null)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <div className="flex-shrink-0 w-full sm:w-1/3 h-48 sm:h-full flex items-center justify-center mb-4 sm:mb-0">
                  {modalVideo.video_file ? (
                    <video
                      src={modalVideo.video_file}
                      controls
                      autoPlay
                      className="w-full h-full object-contain rounded-lg sm:rounded-xl bg-black"
                      poster={modalVideo.thumbnail}
                    />
                  ) : (
                    <img
                      src={modalVideo.thumbnail}
                      alt={modalVideo[`title_${lang}`] || modalVideo.title}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center sm:px-4 lg:px-8">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-blue-700">
                    {modalVideo[`title_${lang}`] || modalVideo.title}
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base mb-2 line-clamp-3">
                    {modalVideo[`description_${lang}`] || modalVideo.description}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm mb-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span>{modalVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span>{modalVideo.views} {t("videos.views")}</span>
                    </div>
                    {/* YENİ: Smart Rating Bar - modal içinde */}
                    <div onClick={handleRatingClick}>
                      <SmartVideoRatingBar videoId={modalVideo.id} compact={true} />
                    </div>
                  </div>
                  <p className="text-blue-600 text-xs sm:text-sm font-semibold">
                    {modalVideo[`instructor_${lang}`] || modalVideo.instructor}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10 lg:mt-12"
        >
          <button
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 text-sm sm:text-base"
            onClick={() => navigate("/videos")}
          >
            {t("videos.view_all")}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Videos;