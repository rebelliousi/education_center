import React from 'react'
import { motion } from 'framer-motion'
import { Percent, Users, Clock, Star, Gift, Zap } from 'lucide-react'
import { useDiscountItems } from "../hooks/useDiscounts"
import { useTranslation } from "react-i18next"

// Statik kart görsel/tasarım bilgisi (percentage alanı çıkarıldı)
const discountCards = [
  {
    id: 1,
    icon: Clock,
    color: "from-yellow-500 to-orange-600",
    bgGradient: "from-yellow-500/20 to-orange-600/20",
    popular: true,
    validKey: "valid_until",
    coursesKey: "courses",
  },
  {
    id: 2,
    icon: Users,
    color: "from-blue-500 to-purple-600",
    bgGradient: "from-blue-500/20 to-purple-600/20",
    popular: false,
    validKey: "valid_until",
    coursesKey: "courses",
  },
  {
    id: 3,
    icon: Star,
    color: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-500/20 to-pink-600/20",
    popular: false,
    validKey: "valid_until",
    coursesKey: "courses",
  },
  {
    id: 4,
    icon: Zap,
    color: "from-green-500 to-teal-600",
    bgGradient: "from-green-500/20 to-teal-600/20",
    popular: false,
    validKey: "valid_until",
    coursesKey: "courses",
  },
  {
    id: 5,
    icon: Gift,
    // Burayı MAVİ yaptık:
    color: "from-blue-500 to-blue-700",
    bgGradient: "from-blue-500/20 to-blue-700/20",
    popular: false,
    validKey: "valid_until",
    coursesKey: "courses",
  }
]

// Backend'den veya dil dosyasından gelen metinleri eşleştir
const getTranslated = (item: any, field: string, lang: string) => {
  if (!item) return "";
  const key = `${field}_${lang}`;
  return item[key] || item[field] || "";
}

function parseRequirements(requirements: string | string[]) {
  if (Array.isArray(requirements)) return requirements
  if (typeof requirements === "string") {
    return requirements.split("\n").map(s => s.trim()).filter(Boolean)
  }
  return []
}

const Discounts = () => {
  const { data: discounts = [], isLoading, error } = useDiscountItems();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // discountCards ile backend discountları id üzerinden eşleştir, percentage backend'den gelsin
  const discountsWithText = discountCards.map(card => {
    const discount = discounts.find(d => d.id === card.id)
    return {
      ...card,
      percentage: discount?.percentage ?? 0,
      title: getTranslated(discount, "title", lang),
      description: getTranslated(discount, "description", lang),
      requirements: parseRequirements(discount?.[`requirements_${lang}`] || discount?.requirements || []),
      validUntil: getTranslated(discount, "valid_until", lang) || discount?.valid_until || "",
      courses: getTranslated(discount, "courses", lang) || discount?.courses || "",
    }
  })

  return (
    <section id="discounts" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-2">
            {t("discounts.special")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("discounts.title")}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("discounts.description")}
          </p>
        </motion.div>

        {/* Top 3 Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {discountsWithText.slice(0, 3).map((discount, index) => {
            const IconComponent = discount.icon
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl ${
                  discount.popular ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {discount.popular && (
                  <div className="absolute top-[-2px] right-1 sm:top-1   sm:right-1 bg-yellow-400 text-gray-900 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold z-10">
                    {t("discounts.most_popular")}
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${discount.bgGradient}`} />

                <div className="relative p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mt-2 mb-4 sm:mb-6">
                    <div className={`p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r ${discount.color} rounded-xl sm:rounded-2xl shadow-lg`}>
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-0.5 sm:space-x-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{discount.percentage}</span>
                        <Percent className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-900 mt-1 sm:mt-2" />
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-semibold">{t("discounts.off")}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 line-clamp-3">
                    {discount.description}
                  </p>

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">{t("discounts.requirements")}</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {discount.requirements.slice(0, 3).map((requirement, i) => (
                        <li key={i} className="flex items-start space-x-1.5 sm:space-x-2 text-gray-700 text-[10px] sm:text-xs lg:text-sm">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                          <span className="line-clamp-2">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm border-t border-blue-200/50 pt-3 sm:pt-4 lg:pt-6">
                    <div>
                      <span className="text-gray-600 block mb-1">{t("discounts.valid_until")}</span>
                      <p className="text-gray-900 font-semibold line-clamp-1">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">{t("discounts.applies_to")}</span>
                      <p className="text-gray-900 font-semibold line-clamp-3">{discount.courses}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom 2 Discounts - Centered */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          {discountsWithText.slice(3, 5).map((discount, index) => {
            const IconComponent = discount.icon
            return (
              <motion.div
                key={discount.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl md:flex-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${discount.bgGradient}`} />

                <div className="relative p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r ${discount.color} rounded-xl sm:rounded-2xl shadow-lg`}>
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-0.5 sm:space-x-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{discount.percentage}</span>
                        <Percent className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-900 mt-1 sm:mt-2" />
                      </div>
                      <span className="text-gray-700 text-xs sm:text-sm font-semibold">{t("discounts.off")}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 line-clamp-3">
                    {discount.description}
                  </p>

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">{t("discounts.requirements")}</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {discount.requirements.slice(0, 3).map((requirement, i) => (
                        <li key={i} className="flex items-start space-x-1.5 sm:space-x-2 text-gray-700 text-[10px] sm:text-xs lg:text-sm">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                          <span className="line-clamp-2">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm border-t border-blue-200/50 pt-3 sm:pt-4 lg:pt-6">
                    <div>
                      <span className="text-gray-600 block mb-1">{t("discounts.valid_until")}</span>
                      <p className="text-gray-900 font-semibold line-clamp-1">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">{t("discounts.applies_to")}</span>
                      <p className="text-gray-900 font-semibold line-clamp-3">{discount.courses}</p>
                    </div>
                  </div>
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
          className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-200/50 shadow-lg mb-8 sm:mb-10 lg:mb-12"
        >
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 text-center">
            💡 {t("discounts.important_info")}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 text-gray-700">
            <div>
              <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{t("discounts.general_terms")}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>{t("discounts.term_1")}</li>
                <li>{t("discounts.term_2")}</li>
                <li>{t("discounts.term_3")}</li>
                <li>{t("discounts.term_4")}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{t("discounts.how_to_apply")}</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>{t("discounts.apply_1")}</li>
                <li>{t("discounts.apply_2")}</li>
                <li>{t("discounts.apply_3")}</li>
                <li>{t("discounts.apply_4")}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Discounts