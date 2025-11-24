import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const Header = ({ menuItems }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
    >
      <nav className="bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[90rem] mx-auto px-16 lg:px-20">
          <div className="flex justify-between items-center h-28">
            {/* Logo */}
            <motion.div 
              whileHover={{ 
                scale: 1.03,
                letterSpacing: '0.18em',
              }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-white text-[2.75rem] font-light tracking-[0.15em] cursor-pointer relative"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              Greenleaf
              {/* Underline decorativo */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Menu Items - más separados del logo */}
            <div className="flex items-center gap-8">
              <ul className="flex space-x-14 items-center">
              {menuItems.map((item, index) => (
                <li 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link to={item.href}>
                    <motion.div
                      className="text-white/70 hover:text-white transition-colors duration-400 text-[0.9rem] font-light tracking-[0.2em] uppercase relative cursor-pointer"
                      style={{ fontFamily: 'Gotham, sans-serif' }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                  
                  {/* Hover underline effect - más elegante */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredItem === index ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                  />

                  {/* Submenu dropdown - centrado debajo del item */}
                  {item.subItems && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: hoveredItem === index ? 1 : 0,
                        y: hoveredItem === index ? 0 : 10,
                        pointerEvents: hoveredItem === index ? 'auto' : 'none'
                      }}
                      transition={{ 
                        duration: 0.35, 
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="absolute top-full left-0 mt-6 bg-black backdrop-blur-xl rounded-xl shadow-2xl py-4 min-w-[340px] border border-white/30"
                      style={{
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li 
                          key={subIndex}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ 
                            opacity: hoveredItem === index ? 1 : 0,
                            x: hoveredItem === index ? 0 : -8
                          }}
                          transition={{ 
                            duration: 0.25,
                            delay: hoveredItem === index ? subIndex * 0.05 : 0
                          }}
                        >
                          <motion.a
                            href={subItem.href}
                            className="block px-6 py-3.5 text-white/75 hover:text-white transition-colors duration-200 text-[0.875rem] font-light tracking-wide relative overflow-hidden group"
                            style={{ fontFamily: 'Gotham, sans-serif' }}
                            whileHover={{ x: 4 }}
                          >
                            {/* Efecto de fondo en hover */}
                            <motion.div 
                              className="absolute inset-0 bg-white/5"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10">{subItem.name}</span>
                            
                            {/* Indicador visual al lado */}
                            <motion.span
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </motion.a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </li>
              ))}
              </ul>
              
              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header
