import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Menu, X, BookOpen, Play, Users, Tag, Mail, Home, ChevronDown, Check, GraduationCap } from 'lucide-react'
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
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'tk', label: 'TK', name: 'Türkmen' },
  { code: 'ru', label: 'RU', name: 'Русский' }
]

function NavbarBrand({ scrollToSection }: { isScrolled: boolean, scrollToSection: (id: string, forceHome?: boolean) => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-3"
    >
      <button
        className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg focus:outline-none"
        onClick={() => scrollToSection("hero", true)}
        aria-label="Go to Home"
      >
        <GraduationCap className="w-6 h-6 text-white" />
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

  const scrollToSection = (sectionId: string, forceHome?: boolean) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
              <span>{languages.find(l => l.code === i18n.language)?.label || "EN"}</span>
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
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? 'text-gray-700 hover:bg-blue-50' 
                : 'text-white hover:bg-white/10'
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-2xl"
        >
          <div className="px-2 py-4 space-y-2">
            {localizedNavItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-xl font-semibold text-base"
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
            {/* Dil Dropdown Mobil */}
            <div className="pt-2 border-t border-blue-100 relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(prev => !prev)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl flex items-center justify-between shadow hover:shadow-lg transition-all duration-300"
                aria-label="Select language"
              >
                <span>{languages.find(l => l.code === i18n.language)?.label || "EN"}</span>
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
                    className="absolute left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-100 z-20 flex flex-col"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code)
                          setIsLangDropdownOpen(false)
                          setIsMobileMenuOpen(false)
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
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar