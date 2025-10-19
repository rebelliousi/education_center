import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

const activities = [
  {
    id: 1,
    title: "Science Fair 2024",
    description: "Students showcase innovative projects in physics, chemistry, and biology.",
    date: "March 15, 2024",
    location: "Main Auditorium",
    participants: 120,
    image: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: "🏆",
    color: "from-yellow-400 via-orange-500 to-pink-500",
    featured: true
  },
  {
    id: 2,
    title: "Robotics Workshop",
    description: "Hands-on experience building and programming autonomous robots.",
    date: "March 22, 2024",
    location: "Tech Lab",
    participants: 45,
    image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: "🤖",
    color: "from-blue-500 via-cyan-400 to-green-300"
  },
  {
    id: 3,
    title: "Chemistry Magic Show",
    description: "Spectacular demonstrations of chemical reactions and phenomena.",
    date: "March 28, 2024",
    location: "Chemistry Lab",
    participants: 80,
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: "⚗️",
    color: "from-green-400 via-teal-400 to-blue-400"
  },
  {
    id: 4,
    title: "Astronomy Night",
    description: "Stargazing session with telescopes and constellation mapping.",
    date: "April 5, 2024",
    location: "Observatory Deck",
    participants: 60,
    image: "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=900",
    icon: "🌟",
    color: "from-purple-500 via-fuchsia-400 to-pink-400"
  },
  {
    id: 5,
    title: "Environmental Action Day",
    description: "Community cleanup and sustainability awareness activities.",
    date: "April 12, 2024",
    location: "Campus Grounds",
    participants: 150,
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: "🌱",
    color: "from-emerald-400 via-green-400 to-lime-300"
  },
  {
    id: 6,
    title: "3D Printing Workshop",
    description: "Learn to design and print custom scientific instruments.",
    date: "April 18, 2024",
    location: "Maker Space",
    participants: 35,
    image: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=900",
    icon: "🖨️",
    color: "from-cyan-500 via-blue-500 to-violet-500"
  }
];

const bgHero = "bg-gradient-to-br from-blue-50 via-white to-blue-100";
const glassBg = "bg-white/70 backdrop-blur-xl";
const glassDark = "bg-slate-900/60 backdrop-blur-2xl";
const glow = "shadow-[0_0_40px_10px_rgba(0,200,255,0.15)]";

// Modern, wow, hero-uyumlu Activites!
const Activities = () => {
  return (
    <section
      id="activities"
      className="py-24 min-h-screen relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top right, #38bdf8 10%, #818cf8 90%, #f0f9ff 100%)" }}
    >
      {/* Glow bg shapes */}
      <div className="absolute -top-32 -left-24 w-[600px] h-[400px] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-blue-300 via-cyan-200 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] rounded-full blur-2xl opacity-40 bg-gradient-to-tl from-blue-200 via-fuchsia-300 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight drop-shadow-lg">
            <span className="text-blue-600">Latest</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Activities
            </span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
            Experience science in motion! Dive into our hands-on workshops, starry nights, and creative labs where learning is an adventure.
          </p>
        </motion.div>

        {/* Featured Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className={`mb-20 rounded-3xl ring-2 ring-blue-300/10 ${glow} group hover:scale-[1.01] transition-all duration-300`}
        >
          {activities.filter(a => a.featured).map((activity) => (
            <div
              key={activity.id}
              className={`grid lg:grid-cols-2 gap-0 items-stretch ${glassBg} overflow-hidden rounded-3xl`}
            >
              {/* Image side */}
              <div className="relative h-72 lg:h-[420px] overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${activity.color} opacity-70`} />
                <div className="absolute top-8 left-8 text-5xl drop-shadow-xl">{activity.icon}</div>
                <div className="absolute top-8 right-8 bg-blue-100/80 shadow px-4 py-1 rounded-full border border-blue-200 font-bold text-blue-700 text-base tracking-wide uppercase">
                  Featured
                </div>
              </div>

              {/* Text side */}
              <div className="flex flex-col justify-center px-10 py-14 relative z-10">
                <h3 className="text-4xl font-extrabold text-blue-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-xl text-gray-700 mb-8 font-medium">
                  {activity.description}
                </p>

                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-base">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    {activity.date}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-base">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2 text-fuchsia-700 font-semibold text-base">
                    <Users className="h-5 w-5 text-fuchsia-500" />
                    {activity.participants} participants
                  </div>
                </div>

                <button className="group flex items-center gap-2 px-8 py-4 text-lg rounded-full font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Other Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {activities.filter(a => !a.featured).map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: idx * 0.07 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`relative rounded-2xl overflow-hidden border border-blue-100/20 hover:border-blue-300/40
                shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer ${glassDark}`}
            >
              <div className="relative h-52">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-400"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-70`} />
                <div className="absolute top-4 left-4 text-3xl drop-shadow">{activity.icon}</div>
              </div>
              <div className="p-7 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">{activity.title}</h3>
                <p className="text-gray-700 text-base mb-4 font-medium line-clamp-2">{activity.description}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    {activity.date}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 text-sm">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2 text-fuchsia-700 text-sm">
                    <Users className="h-4 w-4 text-fuchsia-400" />
                    {activity.participants} participants
                  </div>
                </div>
                <button className="mt-auto flex items-center gap-2 px-6 py-3 rounded-full 
                  font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow 
                  hover:from-blue-700 hover:to-blue-900 transition-all group-hover:scale-105">
                  <span>View Details</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Activities