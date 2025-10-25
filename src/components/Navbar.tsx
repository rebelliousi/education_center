import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Menu, X, BookOpen, Play, Users, Tag, Mail, Home, ChevronDown, Check, GraduationCap, Globe } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const navItems = [
  { id: 'hero', icon: Home },
  { id: 'courses', icon: BookOpen },
  { id: 'activities', icon: Star },
  { id: 'videos', icon: Play },
  { id: 'teachers', icon: Users },
  { id: 'discounts', icon: Tag },
  { id: 'contact', icon: Mail },
]

const languages = [
  { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'tk', label: 'TK', name: 'Türkmen', flag: '🇹🇲' },
  { code: 'ru', label: 'RU', name: 'Русский', flag: '🇷🇺' }
]

function NavbarBrand({ scrollToSection }: { isScrolled: boolean, scrollToSection: (id: string, forceHome?: boolean) => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-2 sm:gap-3"
    >
      <button
        className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md lg:shadow-lg focus:outline-none"
        onClick={() => scrollToSection("hero", true)}
        aria-label="Go to Home"
      >
        <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
      </button>
    </motion.div>
  );
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const navigate = useNavigate();

  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isLangDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const desktop = desktopDropdownRef.current
      const mobile = mobileDropdownRef.current
      if (
        desktop &&
        !desktop.contains(e.target as Node) &&
        mobile &&
        !mobile.contains(e.target as Node)
      ) {
        setIsLangDropdownOpen(false)
      } else if (desktop && !desktop.contains(e.target as Node) && !mobile) {
        setIsLangDropdownOpen(false)
      } else if (mobile && !mobile.contains(e.target as Node) && !desktop) {
        setIsLangDropdownOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [isLangDropdownOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function handleClick(e: MouseEvent) {
      const menu = mobileMenuRef.current;
      if (menu && !menu.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isMobileMenuOpen]);

  // GÜNCEL: Menü itemine tıklandığında önce menüyü kapatıp sonra scroll yapıyoruz (mobilde)
  const scrollToSection = (sectionId: string, forceHome?: boolean) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 350); // animasyon süresiyle uyumlu
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (forceHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }

  const localizedNavItems = navItems.map(item => ({
    ...item,
    label: t(`nav.${item.id}`)
  }))

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md lg:shadow-lg border-b border-blue-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 lg:h-16">
          <NavbarBrand isScrolled={isScrolled} scrollToSection={scrollToSection} />

          {/* Masaüstü Menü */}
          <div className="hidden lg:flex items-center space-x-1">
            {localizedNavItems.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-white hover:text-blue-200 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Dil Dropdown Desktop */}
          <div className="relative hidden lg:block" ref={desktopDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(prev => !prev)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Select language"
            >
              <span>{currentLanguage.label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-40 py-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-100 z-20 flex flex-col"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code)
                        setIsLangDropdownOpen(false)
                      }}
                      className={`flex items-center justify-between w-full px-5 py-2 rounded-lg font-semibold transition-all duration-200
                        ${i18n.language === lang.code
                          ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400"
                          : "text-gray-700 hover:bg-blue-50"}
                      `}
                    >
                      <span>{lang.label}</span>
                      {i18n.language === lang.code &&
                        <Check className="w-4 h-4 text-blue-700" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-1.5 sm:p-2 rounded-lg transition-colors ${
              isScrolled 
                ? 'text-gray-700 hover:bg-blue-50' 
                : 'text-white hover:bg-white/10'
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          ref={mobileMenuRef}
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg"
        >
          <div className="px-2 sm:px-3 py-3 sm:py-4 space-y-1 sm:space-y-2 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* Language Selector - En Üstte */}
            <div className="relative mb-3" ref={mobileDropdownRef}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      {t("nav.select_language") || "Select Language"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLangDropdownOpen(prev => !prev)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Current Language Display */}
                <div className="flex items-center space-x-2.5 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <span className="text-2xl">{currentLanguage.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold text-gray-900">{currentLanguage.name}</p>
                    <p className="text-xs text-gray-500">{currentLanguage.label}</p>
                  </div>
                </div>

                {/* Language Options Dropdown */}
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      {languages.filter(l => l.code !== i18n.language).map((lang, index) => (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            i18n.changeLanguage(lang.code)
                            setIsLangDropdownOpen(false)
                          }}
                          className="flex items-center space-x-2.5 bg-white hover:bg-blue-50 rounded-lg px-3 py-2 shadow-sm w-full transition-all duration-200 group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {lang.name}
                            </p>
                            <p className="text-xs text-gray-500">{lang.label}</p>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2" />

            {/* Menu Items */}
            {localizedNavItems.map(({ id, label, icon: Icon }, index) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.03 }}
                onClick={() => scrollToSection(id)}
                className="w-full flex items-center space-x-2.5 sm:space-x-3 px-3 py-2 sm:px-4 sm:py-2.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-colors"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar