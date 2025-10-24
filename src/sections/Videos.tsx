import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, Eye, Star, X } from 'lucide-react'
import { useVideos } from "../hooks/useVideos"
import { useViewVideo } from "../hooks/useViewVideo"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const Videos = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "tk"
  const navigate = useNavigate();

  // Videoları çek
  const { data: videos = [], isLoading: videosLoading, error: videosError } = useVideos()

  // İzlenme mutation hook'u
  const { mutate: viewVideo, isPending: viewPending } = useViewVideo()

  // Modal state - sadece grid videoları için
  const [modalVideo, setModalVideo] = useState<any>(null)
  const [featuredPlaying, setFeaturedPlaying] = useState<boolean>(false)

  // İlk "featured" videoyu bul (varsa)
  const promotionalVideo = videos.find(v => v.featured) || videos[0]

  // Sadece en yeni 8 video (id veya created alanına göre sıralama yapılabilir)
  const sortedVideos = [...videos]
    .filter(video => !video.featured)
    .sort((a, b) => (b.created || b.id) - (a.created || a.id))
    .slice(0, 8)

  return (
    <section id="videos" className="py-24 min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Featured Section Title (i18n) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-blue-700 mb-6">
            {t("videos.featured_section_title") || "Merkezimiz hakynda"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("videos.description")}
          </p>
        </motion.div>

        {/* Featured/Promotional Video */}
        {promotionalVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 lg:h-80 overflow-hidden">
                {/* Thumbnail + Play Icon or Video */}
                {!featuredPlaying ? (
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
                        className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 hover:bg-white/30 transition-all duration-300 shadow-md"
                        onClick={() => {
                          setFeaturedPlaying(true)
                          viewVideo(promotionalVideo.id)
                        }}
                        disabled={viewPending}
                      >
                        <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                      </motion.button>
                    </div>
                    <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                      {t("videos.featured")}
                    </div>
                  </>
                ) : (
                  <video
                    src={promotionalVideo.video_file}
                    controls
                    autoPlay
                    className="w-full h-full object-cover rounded-xl"
                    poster={promotionalVideo.thumbnail}
                  />
                )}
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {promotionalVideo[`title_${lang}`] || promotionalVideo.title}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {promotionalVideo[`description_${lang}`] || promotionalVideo.description}
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>{promotionalVideo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span>{promotionalVideo.views} {t("videos.views")}</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold">
                  <Play className="h-5 w-5" />
                  <span>{t("videos.watch_now")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Grid Section Title (i18n - Egitici wideolar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl lg:text-4xl font-extrabold text-blue-700 mb-4">
            {t("videos.educational_grid_title") || "Egitici wideolar"}
          </h3>
        </motion.div>

        {/* Educational Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-lg"
              onClick={() => setModalVideo(video)}
            >
              <div className="relative h-40 overflow-hidden">
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
                    className="w-14 h-14 bg-white/25 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 shadow-md"
                    disabled={viewPending}
                  >
                    <Play className="h-5 w-5 text-white ml-1" fill="currentColor" />
                  </motion.button>
                </div>
                <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white px-2 py-1 rounded text-xs font-semibold shadow">
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {video[`title_${lang}`] || video.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {video[`description_${lang}`] || video.description}
                </p>
                <p className="text-blue-600 text-xs mb-3 font-semibold">
                  {video[`instructor_${lang}`] || video.instructor}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-blue-600" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal sadece grid videoları için */}
        <AnimatePresence>
          {modalVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.96, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-[80vw] h-[340px] flex items-center p-8 relative"
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-blue-700 z-10"
                  onClick={() => setModalVideo(null)}
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex-shrink-0 w-1/3 h-full flex items-center justify-center">
                  {modalVideo.video_file ? (
                    <video
                      src={modalVideo.video_file}
                      controls
                      autoPlay
                      className="w-full h-full object-contain rounded-xl bg-black"
                      poster={modalVideo.thumbnail}
                    />
                  ) : (
                    <img
                      src={modalVideo.thumbnail}
                      alt={modalVideo[`title_${lang}`] || modalVideo.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center px-8">
                  <h2 className="text-2xl font-bold mb-2 text-blue-700">
                    {modalVideo[`title_${lang}`] || modalVideo.title}
                  </h2>
                  <p className="text-gray-700 text-base mb-2">
                    {modalVideo[`description_${lang}`] || modalVideo.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{modalVideo.duration}</span>
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span>{modalVideo.views} {t("videos.views")}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{modalVideo.rating}</span>
                  </div>
                  <p className="text-blue-600 text-xs font-semibold">
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
          className="text-center mt-12"
        >
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
            onClick={() => navigate("/videos")}
          >
            {t("videos.view_all")}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Videos