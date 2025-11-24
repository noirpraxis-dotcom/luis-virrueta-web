import { motion } from 'framer-motion'
import { useState } from 'react'

const Header = ({ menuItems }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
    >
      <nav className="bg-black/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05, letterSpacing: '0.15em' }}
              transition={{ duration: 0.3 }}
              className="font-gotham text-elegant-white text-3xl font-bold tracking-wider cursor-pointer"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              Greenleaf
            </motion.div>

            {/* Menu Items */}
            <ul className="flex space-x-8 items-center">
              {menuItems.map((item, index) => (
                <li 
                  key={index} 
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <a
                    href={item.href}
                    className="text-elegant-gray hover:text-white transition-colors duration-300 text-sm font-normal tracking-[0.15em]"
                    style={{ fontFamily: 'Gotham, sans-serif' }}
                  >
                    {item.name}
                  </a>
                  
                  {/* Hover underline effect */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredItem === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-elegant-white origin-left"
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
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-md rounded-lg shadow-xl py-2 min-w-[200px]"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.href}
                            className="block px-6 py-3 text-elegant-gray hover:text-white hover:bg-white/10 transition-all duration-200 text-base"
                          >
                            {subItem.name}
                          </a>
                        </li>
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
