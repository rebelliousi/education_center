import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Eye, Star } from 'lucide-react'
import { useVideos } from "../hooks/useVideos"
import { useCategories } from "../hooks/useCategories"
import { useViewVideo } from "../hooks/useViewVideo"
import { useTranslation } from "react-i18next"

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState<string | number>('all')
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "tk"

  // Videoları çek
  const { data: videos = [], isLoading: videosLoading, error: videosError } = useVideos()
  // Kategorileri çek
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()

  // İzlenme mutation hook'u
  const { mutate: viewVideo, isPending: viewPending } = useViewVideo()

  // Kategorileri "All Videos" ile birlikte hazırla
  const allCategory = { id: 'all', name: t("videos.all_videos"), count: videos.length }
  const categoryList = [allCategory, ...categories.map(cat => ({
    ...cat,
    count: videos.filter(v => v.category === cat.name).length
  }))]

  // İlk "featured" videoyu bul (varsa)
  const promotionalVideo = videos.find(v => v.featured) || videos[0]

  // Gridde sadece featured olmayan videoları göster
  const filteredVideos = activeCategory === 'all'
    ? videos.filter(video => !video.featured)
    : videos.filter(video => video.category === activeCategory && !video.featured)

  return (
    <section id="videos" className="py-24 min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("videos.educational")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("videos.title")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("videos.description")}
          </p>
        </motion.div>

        {/* Promotional Video */}
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
                {promotionalVideo.video_file ? (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster={promotionalVideo.thumbnail}
                  >
                    <source src={promotionalVideo.video_file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={promotionalVideo.thumbnail}
                    alt={promotionalVideo[`title_${lang}`] || promotionalVideo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-blue-600/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 hover:bg-white/30 transition-all duration-300 shadow-md"
                    onClick={() => viewVideo(promotionalVideo.id)}
                    disabled={viewPending}
                  >
                    <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                  </motion.button>
                </div>
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                  {t("videos.featured")}
                </div>
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
                  <span>{t("videos.watch_now")}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categoryList.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white/40 text-gray-900 hover:bg-white/60 border border-blue-200/50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Educational Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-lg"
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
                    onClick={() => viewVideo(video.id)}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800">
            {t("videos.view_all")}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Videos