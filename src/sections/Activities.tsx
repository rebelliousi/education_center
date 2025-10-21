import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSocialActivities } from "../hooks/useActivities"
import type { SocialActivityType } from '../hooks/useActivities'
import { useTranslation } from "react-i18next"

const Activities = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { t } = useTranslation()

  const { data: activities = [], isLoading, error } = useSocialActivities();

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
            {visibleActivities.map((activity:SocialActivityType, index:number) => (
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
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${activity.color} opacity-60`} />
                    <div className="absolute top-3 left-3 text-2xl">{activity.icon}</div>
                    <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white font-semibold text-xs">{t("activities.featured")}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {activity.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="line-clamp-1">{activity.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="line-clamp-1">{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{activity.participants} {t("activities.participants")}</span>
                      </div>
                    </div>

                    <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold text-sm w-full">
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
    </section>
  )
}

export default Activities