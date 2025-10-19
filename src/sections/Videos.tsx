import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Eye, Star } from 'lucide-react'

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const promotionalVideo = {
    id: 'promo',
    title: "Welcome to Goshmaca Science Center",
    description: "Discover the spirit of innovation and learning that defines our unique educational community",
    duration: "3:45",
    views: "12.5K",
    thumbnail: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true
  }

  const educationalVideos = [
    {
      id: 1,
      title: "Quantum Mechanics Explained Simply",
      description: "Understanding the fundamental principles of quantum physics",
      duration: "15:30",
      views: "8.2K",
      rating: 4.9,
      category: "physics",
      thumbnail: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Dr. Sarah Chen"
    },
    {
      id: 2,
      title: "Organic Chemistry Reactions",
      description: "Step-by-step guide to understanding organic reactions",
      duration: "22:15",
      views: "6.7K",
      rating: 4.8,
      category: "chemistry",
      thumbnail: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Prof. Michael Rodriguez"
    },
    {
      id: 3,
      title: "DNA Replication Process",
      description: "Molecular mechanisms of genetic information transfer",
      duration: "18:45",
      views: "9.1K",
      rating: 4.9,
      category: "biology",
      thumbnail: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Dr. Emily Watson"
    },
    {
      id: 4,
      title: "Solar System Formation",
      description: "How our solar system came to be over billions of years",
      duration: "25:20",
      views: "11.3K",
      rating: 4.8,
      category: "astronomy",
      thumbnail: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Dr. James Parker"
    },
    {
      id: 5,
      title: "Climate Change Science",
      description: "Understanding global warming and its environmental impact",
      duration: "20:10",
      views: "15.6K",
      rating: 4.9,
      category: "environmental",
      thumbnail: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Dr. Lisa Anderson"
    },
    {
      id: 6,
      title: "Robotics Programming Basics",
      description: "Introduction to programming autonomous robotic systems",
      duration: "28:30",
      views: "7.8K",
      rating: 4.7,
      category: "technology",
      thumbnail: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Prof. David Kim"
    },
    {
      id: 7,
      title: "Marine Ecosystem Dynamics",
      description: "Exploring ocean life and underwater ecosystems",
      duration: "19:45",
      views: "5.9K",
      rating: 4.8,
      category: "biology",
      thumbnail: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Dr. Maria Santos"
    },
    {
      id: 8,
      title: "Renewable Energy Technologies",
      description: "Comprehensive overview of sustainable energy solutions",
      duration: "24:15",
      views: "13.2K",
      rating: 4.9,
      category: "environmental",
      thumbnail: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=600",
      instructor: "Prof. Robert Green"
    }
  ]

  const categories = [
    { id: 'all', label: 'All Videos', count: educationalVideos.length },
    { id: 'physics', label: 'Physics', count: educationalVideos.filter(v => v.category === 'physics').length },
    { id: 'chemistry', label: 'Chemistry', count: educationalVideos.filter(v => v.category === 'chemistry').length },
    { id: 'biology', label: 'Biology', count: educationalVideos.filter(v => v.category === 'biology').length },
    { id: 'astronomy', label: 'Astronomy', count: educationalVideos.filter(v => v.category === 'astronomy').length },
    { id: 'environmental', label: 'Environmental', count: educationalVideos.filter(v => v.category === 'environmental').length },
    { id: 'technology', label: 'Technology', count: educationalVideos.filter(v => v.category === 'technology').length }
  ]

  const filteredVideos = activeCategory === 'all'
    ? educationalVideos
    : educationalVideos.filter(video => video.category === activeCategory)

  return (
    <section
      id="videos"
      className="py-24 min-h-screen "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Educational{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Videos
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in our comprehensive video library featuring promotional content
            and in-depth educational tutorials across all scientific disciplines.
          </p>
        </motion.div>

        {/* Promotional Video */}
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
                <img
                  src={promotionalVideo.thumbnail}
                  alt={promotionalVideo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-blue-600/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 hover:bg-white/30 transition-all duration-300 shadow-md"
                  >
                    <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                  </motion.button>
                </div>
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                  Featured
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {promotionalVideo.title}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {promotionalVideo.description}
                </p>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>{promotionalVideo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span>{promotionalVideo.views} views</span>
                  </div>
                </div>

                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 font-semibold">
                  <Play className="h-5 w-5" />
                  <span>Watch Now</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white/40 text-gray-900 hover:bg-white/60 border border-blue-200/50'
                }`}
              >
                {category.label} ({category.count})
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
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-white/25 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 shadow-md"
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
                  {video.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {video.description}
                </p>
                <p className="text-blue-600 text-xs mb-3 font-semibold">
                  {video.instructor}
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
            View All Videos
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Videos