import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
            <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-8">
              {/* Efectos decorativos */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-elegant-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-elegant-white rounded-full blur-3xl" />
              </div>

              {/* Logo/Título */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-elegant-white text-5xl font-bold mb-12 z-10"
                style={{ fontFamily: 'Gotham, sans-serif' }}
              >
                Greenleaf
              </motion.div>

              {/* Menu Items */}
              <motion.ul
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="space-y-6 z-10 w-full max-w-md"
              >
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="relative"
                  >
                    <div>
                      <motion.a
                        href={item.href}
                        onClick={item.subItems ? (e) => {
                          e.preventDefault()
                          setExpandedItem(expandedItem === index ? null : index)
                        } : onClose}
                        whileHover={{ x: 10, scale: 1.05 }}
                        className="block text-elegant-gray hover:text-white text-3xl font-medium tracking-wide transition-colors duration-300 py-2"
                        style={{ fontFamily: 'Gotham, sans-serif' }}
                      >
                        {item.name}
                        {item.subItems && (
                          <motion.span
                            animate={{ rotate: expandedItem === index ? 180 : 0 }}
                            className="inline-block ml-2"
                          >
                            ▼
                          </motion.span>
                        )}
                      </motion.a>

                      {/* Submenú */}
                      <AnimatePresence>
                        {item.subItems && expandedItem === index && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden ml-6 mt-2 space-y-2"
                          >
                            {item.subItems.map((subItem, subIndex) => (
                              <motion.li
                                key={subIndex}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <a
                                  href={subItem.href}
                                  onClick={onClose}
                                  className="block text-elegant-gray hover:text-white text-xl py-1 transition-colors duration-200"
                                  style={{ fontFamily: 'Gotham, sans-serif' }}
                                >
                                  - {subItem.name}
                                </a>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Línea decorativa */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      className="h-px bg-gradient-to-r from-transparent via-elegant-white to-transparent origin-left"
                    />
                  </motion.li>
                ))}
              </motion.ul>

              {/* Close hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 text-elegant-gray text-sm z-10"
              >
                Toca fuera para cerrar
              </motion.p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
