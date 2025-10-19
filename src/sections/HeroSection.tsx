import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, BookOpen } from 'lucide-react'
import gsap from 'gsap'
import img from '../../public/image 2.svg' // kendi görsel yolun

const SHAPE_CLASSES = [
  "w-4 h-4 bg-blue-200 rounded-full",
  "w-6 h-6 bg-blue-300 rounded-lg",
  "w-4 h-4 bg-blue-300 rounded-full",
  "w-6 h-6 bg-blue-200 rounded-lg"
]
const SHAPE_COUNT = 20
const ICONS = ['⚛️', '🔬', '🧪', '🌟', '💫', '🔭','⚛️', '🔬', '🧪', '🌟', '💫', '🔭']

const HERO_WIDTH = 1300
const HERO_HEIGHT = 800

const Hero = () => {
  const floatingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (floatingRef.current) {
      gsap.to(floatingRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100"
      aria-label="Hero section"
    >
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
                <span className="text-blue-700 font-semibold">Welcome to the Future of Learning</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              <span className="text-blue-600">Goshmaca</span> &{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Continuous Science
              </span>{' '}
              <span className="text-gray-800">Center</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              Experience a unique education hub where science comes alive with creativity and technology.
              Discover your passion, connect with passionate educators, and embark on an inspiring learning journey.
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
                aria-label="Explore Courses"
              >
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                <span>Explore Courses</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('videos')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all duration-300"
                aria-label="Watch Videos"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>Watch Videos</span>
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
                <div className="text-3xl font-bold text-blue-600">16+</div>
                <div className="text-gray-600 text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-gray-600 text-sm">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">1000+</div>
                <div className="text-gray-600 text-sm">Students</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Modern ve sade görsel alanı */}
          <div className="flex items-center justify-center w-full">
            <img
              src={img}
              alt="Science Center Visual"
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