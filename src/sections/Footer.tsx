import React from 'react'
import { GraduationCap, Instagram } from 'lucide-react'
import { SiTiktok } from "react-icons/si"
import { motion } from 'framer-motion'
import { useTranslation } from "react-i18next"
import Logo from '../../public/icon.svg'
import { useContactItems } from "../hooks/useFooter"

const iconMap: Record<string, React.ComponentType<any>> = {
  Instagram,
  TikTok: SiTiktok,
}

const Footer = () => {
  const { t } = useTranslation();
  const { data: contactItems = [], isLoading, error } = useContactItems();

  // Filtrele sadece Instagram/TikTok
  const socialItems = contactItems.filter(item =>
    ["Instagram", "TikTok"].includes(item.icon)
  )

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 text-gray-900 py-16 border-t border-blue-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... Brand & Description bölümü ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 items-start">
          {/* Sol: brand, üniversite ismi vs */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center ">
                <img src={Logo} alt="" className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t("footer.brand_name")}</h3>
                <p className="text-sm text-blue-600 font-semibold">{t("footer.brand_tagline")}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md pb-5">
              {t("footer.description")}
            </p>
            <span className="text-gray-500 italic text-base">
            {t("footer.university_name")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:text-right flex flex-col items-end"
          >
            <h4 className="font-bold text-gray-900 mb-6">{t("footer.connect_with_us")}</h4>
            <div className="flex gap-4 md:justify-end mb-6">
              {socialItems.map(item => {
                const IconComponent = iconMap[item.icon]
                if (!IconComponent) return null;
                return (
                  <a
                    key={item.id}
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group"
                    aria-label={item.title}
                  >
                    <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-blue-200/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <span>{t("footer.copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer