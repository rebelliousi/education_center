import React from 'react'
import { GraduationCap, Facebook, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContactItems } from "../hooks/useFooter"

const iconMap = {
  Phone,
  Mail,
  MapPin,
  // Diğer ikonlar varsa buraya ekle
}

const Footer = () => {
  const { data: contactItems = [], isLoading, error } = useContactItems()

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 text-gray-900 py-16 border-t border-blue-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 items-start">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Goshmaca</h3>
                <p className="text-sm text-blue-600 font-semibold">Science Center</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Inspiring minds and shaping futures through innovative science education. Join our community of passionate learners and educators on a journey of scientific discovery.
            </p>
            {/* Contact Items API'dan */}
            <div className="mt-8 flex flex-col gap-4">
              {isLoading && <span className="text-blue-600">Loading contact info...</span>}
              {error && <span className="text-red-600">Contact info error!</span>}
              {contactItems.map(item => {
                const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Phone;
                return (
                  <div key={item.id} className="flex items-center gap-2 text-gray-700 text-sm">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{item.title}:</span>
                    <span>{item.value}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h4 className="font-bold text-gray-900 mb-6">Connect With Us</h4>
            <div className="flex gap-4 md:justify-end">
              <a href="#" className="w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group">
                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group">
                <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group">
                <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-200/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>© 2024 Goshmaca & Continuous Science Center. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer