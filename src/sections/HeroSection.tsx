import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Zap, BookOpen } from 'lucide-react'
import gsap from 'gsap'

const SHAPE_CLASSES = [
  "w-4 h-4 bg-blue-200 rounded-full",
  "w-6 h-6 bg-blue-300 rounded-lg",
  "w-4 h-4 bg-blue-300 rounded-full",
  "w-6 h-6 bg-blue-200 rounded-lg"
]
const SHAPE_COUNT = 20
const ICONS = ['⚛️', '🔬', '🧪', '🌟', '💫', '🔭']

const HERO_WIDTH = 1300 // fallback sabit değer
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

  // Random pozisyonlar oluşturmak için bir kez hesaplanır
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
        {/* Floating Geometric Shapes */}
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

        {/* Science Icons Floating */}
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

          {/* Animated Illustration */}
          <motion.div
            ref={floatingRef}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Science Hub Illustration */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2L13.09 8.26L19 7.27L14.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L9.82 12L5 7.27L10.91 8.26L12 2Z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Science Comes Alive</h3>
                  <p className="text-blue-100">Where creativity meets technology in perfect harmony</p>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  rotate: 360,
                  y: [-10, 10, -10]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 3, repeat: Infinity }
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                aria-hidden="true"
              >
                <span className="text-2xl">⚛️</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  y: { duration: 4, repeat: Infinity },
                  rotate: { duration: 8, repeat: Infinity }
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-white to-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200"
                aria-hidden="true"
              >
                <span className="text-lg">🧪</span>
              </motion.div>

              <motion.div
                animate={{
                  x: [-10, 10, -10],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  x: { duration: 3, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="absolute top-1/2 -left-8 w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center shadow-md"
                aria-hidden="true"
              >
                <Zap className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </motion.div>

              <motion.div
                animate={{
                  x: [10, -10, 10],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  x: { duration: 3.5, repeat: Infinity },
                  opacity: { duration: 2, repeat: Infinity }
                }}
                className="absolute top-1/4 -right-6 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-blue-200"
                aria-hidden="true"
              >
                <span className="text-sm">🔬</span>
              </motion.div>
            </div>
          </motion.div>
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