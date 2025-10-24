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
    color: "from-emerald-500 to-cyan-600",
    bgGradient: "from-emerald-500/20 to-cyan-600/20",
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
            {t("discounts.special")}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("discounts.title")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("discounts.description")}
          </p>
        </motion.div>

        {/* Top 3 Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                className={`relative bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl ${
                  discount.popular ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {discount.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold z-10">
                    {t("discounts.most_popular")}
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
                      <span className="text-gray-700 text-sm font-semibold">{t("discounts.off")}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {discount.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-gray-900 font-semibold mb-3">{t("discounts.requirements")}</h4>
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
                      <span className="text-gray-600">{t("discounts.valid_until")}</span>
                      <p className="text-gray-900 font-semibold">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{t("discounts.applies_to")}</span>
                      <p className="text-gray-900 font-semibold">{discount.courses}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom 2 Discounts - Centered */}
        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto mb-16">
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
                      <span className="text-gray-700 text-sm font-semibold">{t("discounts.off")}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {discount.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {discount.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-gray-900 font-semibold mb-3">{t("discounts.requirements")}</h4>
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
                      <span className="text-gray-600">{t("discounts.valid_until")}</span>
                      <p className="text-gray-900 font-semibold">{discount.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{t("discounts.applies_to")}</span>
                      <p className="text-gray-900 font-semibold">{discount.courses}</p>
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
          className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 {t("discounts.important_info")}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="text-gray-900 font-semibold mb-3">{t("discounts.general_terms")}</h4>
              <ul className="space-y-2 text-sm">
                <li>{t("discounts.term_1")}</li>
                <li>{t("discounts.term_2")}</li>
                <li>{t("discounts.term_3")}</li>
                <li>{t("discounts.term_4")}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3">{t("discounts.how_to_apply")}</h4>
              <ul className="space-y-2 text-sm">
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