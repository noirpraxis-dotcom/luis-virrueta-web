import { motion } from 'framer-motion'
import { useState } from 'react'

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
        <div className="max-w-[90rem] mx-auto px-12 lg:px-16">
          <div className="flex justify-between items-center h-28">
            {/* Logo */}
            <motion.div 
              whileHover={{ 
                scale: 1.03,
                letterSpacing: '0.18em',
              }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-white text-4xl font-light tracking-[0.15em] cursor-pointer relative"
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
            <ul className="flex space-x-12 items-center">
              {menuItems.map((item, index) => (
                <li 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.a
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors duration-400 text-sm font-light tracking-[0.2em] uppercase relative"
                    style={{ fontFamily: 'Gotham, sans-serif' }}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.a>
                  
                  {/* Hover underline effect - más elegante */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredItem === index ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                  />

                  {/* Submenu dropdown */}
                  {item.subItems && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: hoveredItem === index ? 1 : 0,
                        y: hoveredItem === index ? 0 : -10,
                        display: hoveredItem === index ? 'block' : 'none'
                      }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/98 backdrop-blur-xl rounded-xl shadow-2xl py-3 min-w-[280px] border border-white/10"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li 
                          key={subIndex}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <a
                            href={subItem.href}
                            className="block px-6 py-3 text-white/60 hover:text-white transition-all duration-300 text-sm font-light tracking-wide"
                            style={{ fontFamily: 'Gotham, sans-serif' }}
                          >
                            {subItem.name}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header
