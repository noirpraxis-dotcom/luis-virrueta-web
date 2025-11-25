import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const MobileMenu = ({ isOpen, onClose, menuItems }) => {
  const [expandedItem, setExpandedItem] = useState(null)

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -50,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 md:block lg:hidden"
        >
          {/* Backdrop con blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Menu Container */}
          <motion.nav
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-start pt-20 p-8">
              {/* Efectos decorativos */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#8dc1ab] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8dc1ab] rounded-full blur-3xl" />
              </div>

              {/* Language Selector - Top Right */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-8 right-8 z-20"
              >
                <LanguageSelector />
              </motion.div>

              {/* Menu Items */}
              <motion.ul
                variants={menuVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                exit="closed"
                className="space-y-4 z-10 w-full max-w-md"
              >
                {menuItems.map((item, index) => {
                  const isStore = item.name.toLowerCase().includes('store') || 
                                  item.name.toLowerCase().includes('tienda') || 
                                  item.name.toLowerCase().includes('obchod')
                  
                  return (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="relative"
                    >
                      <div>
                        {item.subItems ? (
                          <motion.button
                            onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                            whileHover={{ x: 5 }}
                            className="block text-white/80 hover:text-white text-2xl font-light tracking-wider transition-colors duration-300 py-3 text-left w-full uppercase"
                            style={{ fontFamily: 'Gotham, sans-serif' }}
                          >
                            {item.name}
                            <motion.span
                              animate={{ rotate: expandedItem === index ? 180 : 0 }}
                              className="inline-block ml-2 text-sm"
                            >
                              ▼
                            </motion.span>
                          </motion.button>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={onClose}
                          >
                            {isStore ? (
                              <motion.div
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(141, 193, 171, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-3 bg-[#8dc1ab] text-black px-8 py-4 rounded-full text-xl font-medium tracking-wider transition-all duration-300 uppercase border-2 border-[#8dc1ab] hover:bg-[#7ab09a] hover:border-[#7ab09a]"
                                style={{ fontFamily: 'Gotham, sans-serif' }}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {item.name}
                              </motion.div>
                            ) : (
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="block text-white/80 hover:text-white text-2xl font-light tracking-wider transition-colors duration-300 py-3 uppercase"
                                style={{ fontFamily: 'Gotham, sans-serif' }}
                              >
                                {item.name}
                              </motion.div>
                            )}
                          </Link>
                        )}

                        {/* Submenú */}
                        <AnimatePresence>
                          {item.subItems && expandedItem === index && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden ml-6 mt-3 space-y-2"
                            >
                              {item.subItems.map((subItem, subIndex) => (
                                <motion.li
                                  key={subIndex}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: subIndex * 0.1 }}
                                >
                                  <Link
                                    to={subItem.href}
                                    onClick={onClose}
                                    className="block text-white/60 hover:text-white text-base py-2 transition-colors duration-200 font-light tracking-wide"
                                    style={{ fontFamily: 'Gotham, sans-serif' }}
                                  >
                                    • {subItem.name}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Línea decorativa sutil */}
                      {!isStore && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2"
                        />
                      )}
                    </motion.li>
                  )
                })}
              </motion.ul>


            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
