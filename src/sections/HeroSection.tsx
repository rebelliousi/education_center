import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react'
import gsap from 'gsap'
import img from '../../public/image 2.svg'
import { useTranslation } from "react-i18next";
import { useCenterStats } from '../hooks/useStats'
import { useBanners } from '../hooks/useBanners' // <-- Banner hookunu import et

const SHAPE_CLASSES = [
  "w-4 h-4 bg-blue-200 rounded-full",
  "w-6 h-6 bg-blue-300 rounded-lg",
  "w-4 h-4 bg-blue-300 rounded-full",
  "w-6 h-6 bg-blue-200 rounded-lg"
]
const SHAPE_COUNT = 20
const ICONS = [
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭'
]
const HERO_WIDTH = 1300
const HERO_HEIGHT = 800

const AUTO_SLIDE_INTERVAL = 3500

const Hero = () => {
  const { t } = useTranslation();
  const floatingRef = useRef<HTMLDivElement>(null)
  const { data: stats, isLoading } = useCenterStats();

  // Bannerları api'dan çekiyoruz
  const { data: banners = [], isLoading: bannersLoading } = useBanners();

  useEffect(() => {
    if (floatingRef.current) {
      gsap.to(floatingRef.current, { y: -20, duration: 2, repeat: -1, yoyo: true, ease: "power2.inOut" })
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // SLIDER STATE
  const [activeIndex, setActiveIndex] = useState(0)
  const [hide, setHide] = useState(false)
  const bannerCount = banners.length
  const timerRef = useRef<number | null>(null)

  // AUTO SLIDE
  useEffect(() => {
    if (hide || bannersLoading || bannerCount === 0) return
    timerRef.current = window.setInterval(() => {
      setActiveIndex(i => (i + 1) % bannerCount)
    }, AUTO_SLIDE_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [hide, bannerCount, bannersLoading])

  // PAUSE/RESUME on hover
  const handleMouseEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }
  const handleMouseLeave = () => {
    if (bannerCount > 0) {
      timerRef.current = window.setInterval(() => {
        setActiveIndex(i => (i + 1) % bannerCount)
      }, AUTO_SLIDE_INTERVAL)
    }
  }

  const closeBanner = () => setHide(true)
  const handleDotClick = (idx: number) => setActiveIndex(idx)

  // Animated background shapes/icons
  const randomShapes = React.useMemo(() =>
    Array.from({ length: SHAPE_COUNT }, () => ({
      x: Math.random() * HERO_WIDTH,
      y: Math.random() * HERO_HEIGHT,
      className: SHAPE_CLASSES[Math.floor(Math.random() * SHAPE_CLASSES.length)],
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 2,
    })), []
  )
  const randomIcons = React.useMemo(() =>
    ICONS.map(icon => ({
      icon,
      x: Math.random() * HERO_WIDTH,
      y: Math.random() * HERO_HEIGHT,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 3,
    })), []
  )

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100" aria-label="Hero section">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {randomShapes.map((shape, i) => (
          <motion.div
            key={i}
            className={`absolute ${shape.className} opacity-20`}
            style={{ left: shape.x, top: shape.y }}
            initial={{ y: 0, rotate: 0, opacity: 0.1 }}
            animate={{
              y: Math.random() * HERO_HEIGHT,
              rotate: 360,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
            }}
          />
        ))}
        {randomIcons.map((iconObj, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{ left: iconObj.x, top: iconObj.y }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: Math.random() * HERO_HEIGHT,
              rotate: 360,
            }}
            transition={{
              duration: iconObj.duration,
              repeat: Infinity,
              delay: iconObj.delay,
            }}
            aria-hidden="true"
          >
            {iconObj.icon}
          </motion.div>
        ))}
      </div>

      {/* Sağ alt köşede otomatik modern slider duyuru */}
      <AnimatePresence>
      {(!hide && !bannersLoading && banners.length > 0) && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 40 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 right-8 z-40 flex flex-col items-end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative flex items-center bg-white shadow-2xl rounded-3xl border border-blue-100 px-10 py-8 w-[420px] max-w-full space-x-7 transition-all duration-300">
            {/* Dots üstte, resmin sağında */}
            <div className="absolute top-4 right-5 flex gap-2 z-10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-3 h-3 rounded-full border 
                    ${activeIndex === idx ? 'bg-blue-600 border-blue-800 scale-110' : 'bg-blue-200 border-blue-200'} 
                    transition`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <img src={banners[activeIndex].image} alt={banners[activeIndex].title} className="w-20 h-20 rounded-2xl object-cover border border-blue-200 shadow-md" />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="font-bold text-xl text-blue-800 break-words mb-1">{banners[activeIndex].title}</div>
              {/* Sadece 2 satır gösterilecek şekilde sınırlama */}
              <div className="text-base text-gray-600 mb-2 line-clamp-2" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>{banners[activeIndex].desc}</div>
              {banners[activeIndex].url &&
                <a
                  href={banners[activeIndex].url}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full px-3 py-1 text-sm mt-1 hover:scale-105 transition"
                >
                  {banners[activeIndex].cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              }
            </div>
            <button
              onClick={closeBanner}
              className="ml-2 bg-blue-50 hover:bg-blue-100 rounded-full p-2 text-blue-600 transition absolute top-4 left-4"
              title="Close announcement"
            >
              <span className="sr-only">Close</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 mb-6"
            >
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
                <span className="text-blue-700 font-semibold">{t("hero.welcome")}</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-blue-600">{t("brand.name")}</span> {t("brand.and")} {' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {t("hero.continuous_science")}
              </span>{' '}
              <span className="text-gray-800">{t("hero.center")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => scrollToSection('courses')}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label={t("hero.explore_courses")}
              >
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                <span>{t("hero.explore_courses")}</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('videos')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all duration-300"
                aria-label={t("hero.watch_videos")}
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>{t("hero.watch_videos")}</span>
              </motion.button>
            </motion.div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.courses ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-sm">{t("hero.courses")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.teachers ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-sm">{t("hero.teachers")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.videos ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-sm">{t("hero.videos")}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Modern ve sade görsel alanı */}
          <div className="flex items-center justify-center w-[700px]">
            <img
              src={img}
              alt={t("hero.visual_alt")}
              className="w-full rounded-2xl object-cover"
              style={{ boxShadow: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero