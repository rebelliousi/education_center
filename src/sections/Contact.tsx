import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { useContactForm } from "../hooks/useSendForms"
import { useContactItems } from "../hooks/useFooter"
import { useTranslation } from "react-i18next"

const iconMap = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  // Diğer iconlar varsa buraya ekleyebilirsin
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  const { mutate: submitContactForm, isPending, isSuccess, error } = useContactForm();
  const { data: contactItems = [], isLoading: contactLoading, error: contactError } = useContactItems();
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFirstSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    submitContactForm({
      ...formData,
      is_verified: false,
      verification_code: '',
    })
    setShowVerification(true)
  }

  const handleVerificationSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    submitContactForm({
      ...formData,
      is_verified: true,
      verification_code: verificationCode,
    })
    setShowVerification(false)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setVerificationCode('')
    setIsVerified(false)
  }

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-2">
            {t("contact.ready")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("contact.journey")}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("contact.get_in_touch")}
          </p>
        </motion.div>

        {/* Contact Cards - Dinamik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
        >
          {contactItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap]  || Phone;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                className="text-center p-4 sm:p-6 lg:p-8 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base line-clamp-2">{item.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-sm p-4 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-blue-200/50 shadow-xl max-w-3xl mx-auto"
        >
          <form className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="name"
                placeholder={t("contact.name_placeholder")}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl bg-blue-50/50 border border-blue-200/50 placeholder-gray-500 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all backdrop-blur-sm"
              />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                placeholder={t("contact.email_placeholder")}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl bg-blue-50/50 border border-blue-200/50 placeholder-gray-500 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all backdrop-blur-sm"
              />
            </div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="subject"
              placeholder={t("contact.subject_placeholder")}
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl bg-blue-50/50 border border-blue-200/50 placeholder-gray-500 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all backdrop-blur-sm"
            />
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              name="message"
              placeholder={t("contact.message_placeholder")}
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl bg-blue-50/50 border border-blue-200/50 placeholder-gray-500 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none backdrop-blur-sm"
            ></motion.textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFirstSubmit}
              className="w-full py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:shadow-lg transition-all shadow-lg flex items-center justify-center gap-2 group"
              disabled={isPending}
            >
              {isPending ? t("contact.sending") : t("contact.send_message")}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            {isSuccess && (
              <div className="text-green-600 font-semibold text-center text-sm sm:text-base">{t("contact.success_message")}</div>
            )}
            {error && (
              <div className="text-red-600 font-semibold text-center text-sm sm:text-base">{t("contact.error_message")}</div>
            )}
          </form>
        </motion.div>

        {/* Verification Modal */}
        {showVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-200"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">{t("contact.verification_title")}</h3>
              <input
                type="text"
                placeholder={t("contact.verification_placeholder")}
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                className="w-full mb-3 sm:mb-4 px-3 py-2.5 sm:px-4 sm:py-3 border border-blue-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setShowVerification(false)}
                  className="w-full py-2.5 sm:py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base"
                >
                  {t("contact.cancel")}
                </button>
                <button
                  onClick={handleVerificationSubmit}
                  className="w-full py-2.5 sm:py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm sm:text-base"
                >
                  {t("contact.verify_and_send")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Contact