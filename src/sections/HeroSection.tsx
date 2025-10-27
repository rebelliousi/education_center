import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react'
import gsap from 'gsap'
import img from '../../public/image 2.svg'
import { useTranslation } from "react-i18next";
import { useCenterStats } from '../hooks/useStats'
import { useBanners } from '../hooks/useBanners'
import Navbar from '../components/Navbar'

const SHAPE_CLASSES = [
  "w-4 h-4 bg-blue-200 rounded-full",
  "w-6 h-6 bg-blue-300 rounded-lg",
  "w-4 h-4 bg-blue-300 rounded-full",
  "w-6 h-6 bg-blue-200 rounded-lg"
]
const SHAPE_COUNT = 20
const ICONS = [
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
  '⚛️', '🔬', '🧪', '🌟', '💫', '🔭',
]
const HERO_WIDTH = 1300
const HERO_HEIGHT = 800

const AUTO_SLIDE_INTERVAL = 3500

function getRandomShapes(count:number, width:number, height:number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    className: SHAPE_CLASSES[Math.floor(Math.random() * SHAPE_CLASSES.length)],
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    rotate: Math.random() * 360,
    targetY: Math.random() * height
  }))
}
function getRandomIcons(iconCount:number, width:number, height:number) {
  return ICONS.slice(0, iconCount).map(icon => ({
    icon,
    x: Math.random() * width,
    y: Math.random() * height,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 3,
    rotate: Math.random() * 360,
    targetY: Math.random() * height
  }))
}

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const floatingRef = useRef<HTMLDivElement>(null)
  const { data: stats, isLoading } = useCenterStats();
  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const [randomShapes, setRandomShapes] = useState(() => 
    getRandomShapes(window.innerWidth < 768 ? 18 : SHAPE_COUNT, window.innerWidth, window.innerHeight < 600 ? 400 : HERO_HEIGHT)
  );
  const [randomIcons, setRandomIcons] = useState(() => 
    getRandomIcons(window.innerWidth < 768 ? 35 : ICONS.length, window.innerWidth, window.innerHeight < 600 ? 400 : HERO_HEIGHT)
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      const width = window.innerWidth < 768 ? window.innerWidth : HERO_WIDTH
      const height = window.innerWidth < 768 ? (window.innerHeight < 600 ? 400 : window.innerHeight) : HERO_HEIGHT
      setRandomShapes(getRandomShapes(window.innerWidth < 768 ? 18 : SHAPE_COUNT, width, height))
      setRandomIcons(getRandomIcons(window.innerWidth < 768 ? 35 : ICONS.length, width, height))
    }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const [activeIndex, setActiveIndex] = useState(0)
  const [hide, setHide] = useState(false)
  const bannerCount = banners.length
  const timerRef = useRef<number | null>(null)

  const lang = i18n.language || 'tr';
  const getTranslated = (obj: any, field: string) => obj && (obj[`${field}_${lang}`] || obj[field]) || "";

  useEffect(() => {
    if (hide || bannersLoading || bannerCount === 0) return
    timerRef.current = window.setInterval(() => {
      setActiveIndex(i => (i + 1) % bannerCount)
    }, AUTO_SLIDE_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [hide, bannerCount, bannersLoading])

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

  const handleBannerClick = () => {
    const id = banners[activeIndex]?.id;
    if (id) navigate(`/banner/${id}`);
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-[65px] pb-12 lg:pt-0 lg:pb-0" 
      aria-label="Hero section"
    >
      {/* Navbar */}
      <Navbar />

      {/* Navbar Separator Line - Mobile Only */}
      <div className="absolute top-14 sm:top-[4.5rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:hidden z-20" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {randomShapes.map((shape, i) => (
          <motion.div
            key={i}
            className={`absolute ${shape.className} opacity-20`}
            style={{ left: shape.x, top: shape.y }}
            initial={{ y: 0, rotate: shape.rotate, opacity: 0.1 }}
            animate={{
              y: shape.targetY,
              rotate: shape.rotate + 360,
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
            className="absolute text-lg md:text-2xl opacity-20"
            style={{ left: iconObj.x, top: iconObj.y }}
            initial={{ y: 0, rotate: iconObj.rotate }}
            animate={{
              y: iconObj.targetY,
              rotate: iconObj.rotate + 360,
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

      {/* BANNER - Mobile optimized */}
      <AnimatePresence>
      {(!hide && !bannersLoading && banners.length > 0) && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 40 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-2 right-2 md:bottom-8 md:right-8 z-40 flex flex-col items-end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative flex items-center bg-white shadow-xl md:shadow-2xl rounded-xl md:rounded-3xl border border-blue-100 px-3 py-3 md:px-10 md:py-8 w-[calc(100vw-1rem)] max-w-[280px] sm:max-w-[320px] md:max-w-[420px] space-x-2 sm:space-x-3 md:space-x-9 transition-all duration-300">
            {/* Dots */}
            <div className="absolute top-1.5 md:top-4 right-2 md:right-5 flex gap-1 md:gap-2 z-10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-1.5 h-1.5 md:w-3 md:h-3 rounded-full border 
                    ${activeIndex === idx ? 'bg-blue-600 border-blue-800 scale-110' : 'bg-blue-200 border-blue-200'} 
                    transition`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            {/* IMAGE */}
            <img 
              src={banners[activeIndex].image} 
              alt={getTranslated(banners[activeIndex], "title")} 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24 rounded-lg md:rounded-2xl object-cover border border-blue-200 shadow-md flex-shrink-0" 
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="font-bold text-xs sm:text-sm md:text-xl text-blue-800 break-words mb-0.5 md:mb-1 line-clamp-1">
                {getTranslated(banners[activeIndex], "title")}
              </div>
              <div className="text-[10px] sm:text-xs md:text-base text-gray-600 mb-1 md:mb-2 line-clamp-1 md:line-clamp-2" style={{
                display: '-webkit-box',
                WebkitLineClamp: isMobile ? 1 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {getTranslated(banners[activeIndex], "desc")}
              </div>
              {banners[activeIndex].url &&
                <button
                  onClick={handleBannerClick}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 text-[10px] sm:text-xs md:text-sm mt-0.5 md:mt-1 hover:scale-105 transition self-start"
                >
                  <span className="truncate">{getTranslated(banners[activeIndex], "cta")}</span>
                  <ArrowRight className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                </button>
              }
            </div>
            {/* CLOSE */}
            <button
              onClick={closeBanner}
              className="bg-blue-50 hover:bg-blue-100 rounded-full p-1 md:p-2 text-blue-600 transition absolute top-1.5 md:top-4 left-1.5 md:left-1"
              title="Close announcement"
            >
              <span className="sr-only">Close</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 md:w-5 md:h-5">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 -mt-8 sm:-mt-12 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
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
              className="flex items-center space-x-2 mb-3 md:mb-6"
            >
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-100 px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" aria-hidden="true" />
                <span className="text-xs sm:text-sm md:text-base text-blue-700 font-semibold">{t("hero.welcome")}</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-gray-900 mb-3 md:mb-6 leading-tight"
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
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-8 max-w-2xl leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
            >
              <motion.button
                onClick={() => scrollToSection('courses')}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm md:text-base"
                aria-label={t("hero.explore_courses")}
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
                <span>{t("hero.explore_courses")}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('videos')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all duration-300 text-xs sm:text-sm md:text-base"
                aria-label={t("hero.watch_videos")}
              >
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
                <span>{t("hero.watch_videos")}</span>
              </motion.button>
            </motion.div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 mt-6 md:mt-12"
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.courses ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-[10px] sm:text-xs md:text-sm">{t("hero.courses")}</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.teachers ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-[10px] sm:text-xs md:text-sm">{t("hero.teachers")}</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                  {isLoading ? "..." : (stats?.videos ?? 0) + "+"}
                </div>
                <div className="text-gray-600 text-[10px] sm:text-xs md:text-sm">{t("hero.videos")}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Görsel */}
          <div className="flex items-center justify-center w-full max-w-xs sm:max-w-md mx-auto lg:max-w-none lg:w-[700px]">
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection