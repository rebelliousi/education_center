import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useSocialActivities } from "../hooks/useActivities"
import type { SocialActivityType } from '../hooks/useActivities'
import { useTranslation } from "react-i18next"

function getCardColor() {
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

  // Responsive: Mobile 1 card, Desktop 3 cards
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cardsPerPage = isMobile ? 1 : 3
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
    <section id="activities" className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 lg:mb-6 px-2">
            {t("activities.recent")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("activities.title")}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            {t("activities.description")}
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 lg:px-8">
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
                className="bg-white/40 backdrop-blur-sm rounded-xl lg:rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-md lg:shadow-lg hover:shadow-xl flex flex-col"
              >
                {/* Mobile: Vertical Layout, Desktop: Horizontal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-72 items-stretch">
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-48 sm:h-56 lg:h-full">
                    <img
                      src={activity.image}
                      alt={activity[`name_${lang}`] || activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCardColor()} opacity-60`} />
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-xl sm:text-2xl">{activity.icon}</div>
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 sm:py-1 rounded-full">
                      <span className="text-white font-semibold text-[10px] sm:text-xs">{t("activities.featured")}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-lg font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {activity[`name_${lang}`] || activity.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-2">
                        {activity[`description_${lang}`] || activity.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 mb-3 lg:mb-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1 truncate">{activity.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1 truncate">{activity[`location_${lang}`] || activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                        <span>{activity.participants} {t("activities.participants")}</span>
                      </div>
                    </div>

                    <button
                      className="flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-2.5 lg:py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold text-xs sm:text-sm w-full"
                      onClick={() => {
                        setActiveActivity(activity);
                        setActiveImageIndex(0);
                      }}
                    >
                      <span>{t("activities.learn_more_btn")}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>

          {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => paginate(-1)}
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label={t("activities.previous")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-20 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label={t("activities.next")}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Mobile Navigation Buttons - Visible only on mobile */}
          <button
            onClick={() => paginate(-1)}
            className="lg:hidden absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
            aria-label={t("activities.previous")}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="lg:hidden absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
            aria-label={t("activities.next")}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 lg:mt-12">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-6 sm:w-8'
                  : 'bg-blue-300 w-1.5 sm:w-2 hover:bg-blue-400'
              }`}
              aria-label={t("activities.goto_page", { page: index + 1 })}
            />
          ))}
        </div>
      </div>

      {/* MODAL - Responsive */}
      <AnimatePresence>
        {activeActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-xl w-full p-5 sm:p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                className="absolute z-50 top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-blue-700 bg-white rounded-full p-1 shadow-sm"
                onClick={() => setActiveActivity(null)}
                aria-label="Close"
              >
                <X className="h-5 w-5  sm:h-6 sm:w-6" />
              </button>
              {/* Gallery slider */}
              <div className="relative mb-4 sm:mb-6">
                <motion.img
                  key={activeActivity.images[activeImageIndex]?.id}
                  src={activeActivity.images[activeImageIndex]?.image}
                  alt={activeActivity[`name_${lang}`] || activeActivity.name}
                  initial={{ opacity: 0, scale: 0.95, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -50 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg sm:rounded-xl shadow"
                />
                {/* Gallery navigation */}
                {activeActivity.images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 -translate-y-1/2 left-1.5 sm:left-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full shadow hover:bg-blue-700 transition"
                      onClick={() => handleImageNav(-1)}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      className="absolute top-1/2 -translate-y-1/2 right-1.5 sm:right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full shadow hover:bg-blue-700 transition"
                      onClick={() => handleImageNav(1)}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </>
                )}
                {/* Gallery indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
                  {activeActivity.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 sm:h-2 rounded-full ${activeImageIndex === idx ? 'bg-blue-600 w-6 sm:w-8' : 'bg-blue-300 w-1.5 sm:w-2'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Modal content */}
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-blue-700">{activeActivity[`name_${lang}`] || activeActivity.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{activeActivity[`description_${lang}`] || activeActivity.description}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  <span>{activeActivity.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="truncate max-w-[150px] sm:max-w-none">{activeActivity[`location_${lang}`] || activeActivity.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  <span>{activeActivity.participants} {t("activities.participants")}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Activities