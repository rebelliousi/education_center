import React from 'react'
import { motion } from 'framer-motion'
import {Percent, Users, Clock, Star, Gift, Zap} from 'lucide-react'

const Discounts = () => {
  const discounts = [
    {
      id: 1,
      percentage: 50,
      title: "Early Bird Special",
      description: "Register for any course 30 days before start date",
      requirements: [
        "Register 30+ days in advance",
        "Pay full tuition upfront",
        "Valid for first-time students"
      ],
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-500/20 to-orange-600/20",
      popular: true,
      validUntil: "Limited Time",
      courses: "All Courses"
    },
    {
      id: 2,
      percentage: 30,
      title: "Group Enrollment",
      description: "Bring 3 or more friends and save together",
      requirements: [
        "Minimum 3 students per group",
        "All must enroll in same course",
        "Group payment required"
      ],
      icon: Users,
      color: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-500/20 to-purple-600/20",
      validUntil: "Ongoing",
      courses: "All Courses"
    },
    {
      id: 3,
      percentage: 25,
      title: "Student Loyalty",
      description: "For students completing 2+ courses with us",
      requirements: [
        "Completed 2+ previous courses",
        "Maintained 4.0+ GPA",
        "Active student status"
      ],
      icon: Star,
      color: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-600/20",
      validUntil: "Ongoing",
      courses: "All Courses"
    },
    {
      id: 4,
      percentage: 20,
      title: "Academic Excellence",
      description: "High school/college students with 3.5+ GPA",
      requirements: [
        "Current student status",
        "3.5+ GPA verification",
        "Valid student ID required"
      ],
      icon: Zap,
      color: "from-green-500 to-teal-600",
      bgGradient: "from-green-500/20 to-teal-600/20",
      validUntil: "Academic Year",
      courses: "Selected Courses"
    },
    {
      id: 5,
      percentage: 15,
      title: "Referral Bonus",
      description: "Refer a friend and both get discounts",
      requirements: [
        "Friend must be new student",
        "Both must complete enrollment",
        "Discount applies to both parties"
      ],
      icon: Gift,
      color: "from-emerald-500 to-cyan-600",
      bgGradient: "from-emerald-500/20 to-cyan-600/20",
      validUntil: "Ongoing",
      courses: "All Courses"
    }
  ]

  return (
    <section id="discounts" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Special{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Discounts
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take advantage of our exclusive discount programs designed to make quality education 
            more accessible. Multiple ways to save on your learning journey!
          </p>
        </motion.div>

        {/* Top 3 Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {discounts.slice(0, 3).map((discount, index) => {
            const IconComponent = discount.icon
            
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl ${
                  discount.popular ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {discount.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold z-10">
                    Most Popular
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${discount.bgGradient}`} />

                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-r ${discount.color} rounded-2xl shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <span className="text-4xl font-bold text-gray-900">{discount.percentage}</span>
                        <Percent className="h-6 w-6 text-gray-900 mt-2" />
                      </div>
                      <span className="text-gray-700 text-sm font-semibold">OFF</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {discount.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-gray-900 font-semibold mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {discount.requirements.map((requirement, i) => (
                        <li key={i} className="flex items-start space-x-2 text-gray-700 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-t border-blue-200/50 pt-6">
                    <div>
                      <span className="text-gray-600">Valid Until:</span>
                      <p className="text-gray-900 font-semibold">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Applies To:</span>
                      <p className="text-gray-900 font-semibold">{discount.courses}</p>
                    </div>
                  </div>

                  <button className={`w-full bg-gradient-to-r ${discount.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                    Claim Discount
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom 2 Discounts - Centered */}
        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto mb-16">
          {discounts.slice(3, 5).map((discount, index) => {
            const IconComponent = discount.icon
            
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl md:flex-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${discount.bgGradient}`} />

                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-r ${discount.color} rounded-2xl shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <span className="text-4xl font-bold text-gray-900">{discount.percentage}</span>
                        <Percent className="h-6 w-6 text-gray-900 mt-2" />
                      </div>
                      <span className="text-gray-700 text-sm font-semibold">OFF</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {discount.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-gray-900 font-semibold mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {discount.requirements.map((requirement, i) => (
                        <li key={i} className="flex items-start space-x-2 text-gray-700 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-t border-blue-200/50 pt-6">
                    <div>
                      <span className="text-gray-600">Valid Until:</span>
                      <p className="text-gray-900 font-semibold">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Applies To:</span>
                      <p className="text-gray-900 font-semibold">{discount.courses}</p>
                    </div>
                  </div>

                  <button className={`w-full bg-gradient-to-r ${discount.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                    Claim Discount
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Discount Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Important Discount Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="text-gray-900 font-semibold mb-3">General Terms:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Discounts cannot be combined with other offers</li>
                <li>• Valid ID and documentation required for verification</li>
                <li>• Discounts apply to tuition fees only</li>
                <li>• Subject to availability and course capacity</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3">How to Apply:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Contact our admissions team for eligibility check</li>
                <li>• Submit required documentation during enrollment</li>
                <li>• Discount will be applied at checkout</li>
                <li>• Questions? Email us at discounts@goshmaca.edu</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
            Apply for Discount
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Discounts