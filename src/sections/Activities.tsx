import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useSocialActivities } from "../hooks/useActivities"
import type { SocialActivityType } from '../hooks/useActivities'
import { useTranslation } from "react-i18next"

function getCardColor() {
  // Sabit mavi gradient
  return "from-blue-200 via-blue-400 to-blue-700";
}

const Activities = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { t, i18n } = useTranslation()
  const lang = i18n.language || "en"

  const { data: activities = [], isLoading, error } = useSocialActivities();
  const [activeActivity, setActiveActivity] = useState<SocialActivityType|null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const cardsPerPage = 3
  const totalPages = Math.ceil(activities.length / cardsPerPage)
  
  const visibleActivities = activities.slice(
    currentIndex * cardsPerPage,
    (currentIndex + 1) * cardsPerPage
  )

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + newDirection
      if (newIndex < 0) return totalPages - 1
      if (newIndex >= totalPages) return 0
      return newIndex
    })
  }

  // Modal image slider (for gallery)
  const handleImageNav = (dir: number) => {
    if (!activeActivity) return
    const total = activeActivity.images.length
    setActiveImageIndex((prev) => {
      const next = prev + dir
      if (next < 0) return total - 1
      if (next >= total) return 0
      return next
    })
  }

  return (
    <section id="activities" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("activities.recent")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("activities.title")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("activities.description")}
          </p>
        </motion.div>

        {/* 3-Column Grid with Featured Card Style */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8">
            <motion.div
              key={`carousel-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="contents"
            >
            {visibleActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl flex flex-col"
              >
                <div className="grid grid-cols-2 h-72 items-stretch">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity[`name_${lang}`] || activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Static mavi gradient arka plan */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCardColor()} opacity-60`} />
                    <div className="absolute top-3 left-3 text-2xl">{activity.icon}</div>
                    <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white font-semibold text-xs">{t("activities.featured")}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {activity[`name_${lang}`] || activity.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity[`description_${lang}`] || activity.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="line-clamp-1">{activity.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="line-clamp-1">{activity[`location_${lang}`] || activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{activity.participants} {t("activities.participants")}</span>
                      </div>
                    </div>

                    <button
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold text-sm w-full"
                      onClick={() => {
                        setActiveActivity(activity);
                        setActiveImageIndex(0);
                      }}
                    >
                      <span>{t("activities.learn_more_btn")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label={t("activities.previous")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label={t("activities.next")}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-blue-300 w-2 hover:bg-blue-400'
              }`}
              aria-label={t("activities.goto_page", { page: index + 1 })}
            />
          ))}
        </div>
      </div>

      {/* MODAL - Modern, Gallery, Animated */}
      <AnimatePresence>
        {activeActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-700"
                onClick={() => setActiveActivity(null)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              {/* Gallery slider */}
              <div className="relative mb-6">
                <motion.img
                  key={activeActivity.images[activeImageIndex]?.id}
                  src={activeActivity.images[activeImageIndex]?.image}
                  alt={activeActivity[`name_${lang}`] || activeActivity.name}
                  initial={{ opacity: 0, scale: 0.95, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -50 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-64 object-cover rounded-xl shadow"
                />
                {/* Gallery navigation */}
                {activeActivity.images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 -translate-y-1/2 left-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition"
                      onClick={() => handleImageNav(-1)}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="absolute top-1/2 -translate-y-1/2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition"
                      onClick={() => handleImageNav(1)}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                {/* Gallery indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {activeActivity.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 rounded-full ${activeImageIndex === idx ? 'bg-blue-600 w-8' : 'bg-blue-300 w-2'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Modal content */}
              <h2 className="text-2xl font-bold mb-2 text-blue-700">{activeActivity[`name_${lang}`] || activeActivity.name}</h2>
              <p className="text-gray-600 text-base mb-6">{activeActivity[`description_${lang}`] || activeActivity.description}</p>
              <div className="flex items-center gap-3 text-sm mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{activeActivity.date}</span>
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{activeActivity[`location_${lang}`] || activeActivity.location}</span>
                <Users className="h-4 w-4 text-blue-600" />
                <span>{activeActivity.participants} {t("activities.participants")}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Activities