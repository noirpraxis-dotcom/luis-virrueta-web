import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import ToolsMenu from './ToolsMenu'

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
            role="button"
            aria-label="Cerrar menú"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClose()}
          />

          {/* Menu Container */}
          <motion.nav
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center p-8">
              {/* Efectos decorativos */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
              </div>

              {/* Herramientas + Tienda — combined button bar at the top */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute top-6 left-6 right-6 z-20"
              >
                <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md">
                  {/* Herramientas side — expands tools inline */}
                  <ToolsMenu splitMobile={true} onClose={onClose} />

                  {/* Divider */}
                  <div className="w-px bg-white/10" />

                  {/* Tienda side */}
                  <Link to="/tienda" onClick={onClose} className="flex-1">
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-white px-4 py-4 transition-all duration-300"
                    >
                      <ShoppingBag className="w-4 h-4 text-fuchsia-300" strokeWidth={1.5} />
                      <span className="text-sm uppercase tracking-[0.15em] font-medium" style={{ fontFamily: 'Space Grotesk, monospace' }}>Tienda</span>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>

              {/* Menu Items */}
              <motion.ul
                variants={menuVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                exit="closed"
                className="space-y-1 z-10 w-full max-w-md"
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
                            whileHover={{ scale: 1.02 }}
                            className="block text-white/70 hover:text-white text-xl font-light tracking-[0.3em] transition-all duration-300 py-4 w-full uppercase relative group text-center"
                            style={{ fontFamily: 'Gotham, sans-serif' }}
                          >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-all duration-300" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              {item.name}
                              <motion.svg
                                animate={{ rotate: expandedItem === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                width="12" height="12" viewBox="0 0 12 12" fill="none"
                                className="opacity-40"
                              >
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </motion.svg>
                            </span>
                          </motion.button>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={onClose}
                          >
                            {!isStore ? (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="block text-white/70 hover:text-white text-xl font-light tracking-[0.3em] transition-all duration-300 py-4 uppercase relative group text-center"
                                style={{ fontFamily: 'Gotham, sans-serif' }}
                              >
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-all duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                  {item.name}
                                  <motion.svg
                                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    className="opacity-25"
                                  >
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </motion.svg>
                                </span>
                              </motion.div>
                            ) : null}
                          </Link>
                        )}

                        {/* Submenú */}
                        <AnimatePresence>
                          {item.subItems && expandedItem === index && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                              className="overflow-hidden ml-8 mt-2 mb-3 space-y-1 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                            >
                              {item.subItems.map((subItem, subIndex) => (
                                <motion.li
                                  key={subIndex}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: subIndex * 0.08 }}
                                >
                                  <Link
                                    to={subItem.href}
                                    onClick={onClose}
                                  >
                                    <motion.div
                                      whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                      className="block text-white/60 hover:text-violet-400 text-sm py-3 px-3 transition-all duration-200 font-light tracking-wider rounded-md"
                                      style={{ fontFamily: 'Gotham, sans-serif' }}
                                    >
                                      <span className="text-violet-400/50 mr-2">•</span>
                                      {subItem.name}
                                    </motion.div>
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Línea decorativa */}
                      {!isStore && !item.subItems && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
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
