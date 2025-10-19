import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, BookOpen, Award } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Quantum Physics Fundamentals",
    description: "Explore the mysterious world of quantum mechanics and particle physics",
    duration: "12 weeks",
    students: 156,
    rating: 4.9,
    level: "Advanced",
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "⚛️",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Organic Chemistry Mastery",
    description: "Master the fundamentals of organic compounds and reactions",
    duration: "10 weeks",
    students: 243,
    rating: 4.8,
    level: "Intermediate",
    image: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "🧪",
    color: "from-blue-400 to-blue-500"
  },
  {
    id: 3,
    title: "Astrophysics & Cosmology",
    description: "Journey through the cosmos and understand the universe's mysteries",
    duration: "14 weeks",
    students: 189,
    rating: 4.9,
    level: "Advanced",
    image: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=400",
    icon: "🌌",
    color: "from-blue-600 to-blue-700"
  },
  {
    id: 4,
    title: "Molecular Biology",
    description: "Dive deep into the molecular mechanisms of life",
    duration: "11 weeks",
    students: 198,
    rating: 4.7,
    level: "Intermediate",
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "🧬",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 5,
    title: "Environmental Science",
    description: "Study environmental systems and sustainability solutions",
    duration: "9 weeks",
    students: 267,
    rating: 4.8,
    level: "Beginner",
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "🌱",
    color: "from-blue-400 to-blue-500"
  },
  {
    id: 6,
    title: "Neuroscience Basics",
    description: "Understand the brain and nervous system functions",
    duration: "13 weeks",
    students: 134,
    rating: 4.9,
    level: "Intermediate",
    image: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "🧠",
    color: "from-blue-600 to-blue-700"
  },
  {
    id: 7,
    title: "Materials Science",
    description: "Explore the properties and applications of advanced materials",
    duration: "10 weeks",
    students: 176,
    rating: 4.6,
    level: "Advanced",
    image: "https://images.pexels.com/photos/2280550/pexels-photo-2280550.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "⚗️",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 8,
    title: "Genetics & Genomics",
    description: "Study heredity and genetic variation in organisms",
    duration: "12 weeks",
    students: 221,
    rating: 4.8,
    level: "Intermediate",
    image: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: "🔬",
    color: "from-blue-400 to-blue-500"
  }
];

const LEVELS = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" }
];

function getLevelColor(level: string) {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-700';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
    case 'Advanced': return 'bg-red-100 text-red-700';
    default: return 'bg-blue-100 text-blue-700';
  }
}

export default function CoursesSection() {
  const [filter, setFilter] = useState("all");

  const filteredCourses = filter === "all"
    ? courses
    : courses.filter(course => course.level === filter);

  return (
    <section id="courses" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">Our Curriculum</span>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Discover Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Diverse Courses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore carefully crafted courses designed to ignite your passion for science and technology.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              onClick={() => setFilter(lvl.value)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border ${
                filter === lvl.value
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
              }`}
              aria-pressed={filter === lvl.value}
            >
              {lvl.label}
            </button>
          ))}
        </motion.div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
              }}
              className="bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl flex flex-col"
              tabIndex={0}
              role="button"
              aria-label={`Learn more about ${course.title}`}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-70`} />
                <div className="absolute top-4 right-4 text-3xl drop-shadow-lg">{course.icon}</div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-white">{course.rating}</span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight min-h-[56px]">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[48px]">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-800 font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl">
            <Award className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Start Learning?</h3>
            <p className="text-blue-100 mb-6">Join thousands of students advancing their scientific knowledge</p>
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              View All Courses
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}