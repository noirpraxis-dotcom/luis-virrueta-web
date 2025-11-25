import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      // Always visible on non-home pages
      setIsVisible(true);
      return;
    }

    // On home page, show after scrolling down
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleClick = () => {
    const phoneNumber = '420776711636'; // Czech phone number
    const message = encodeURIComponent('Hola! Me gustaría obtener más información sobre tus servicios.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 20px 40px -15px rgba(141, 193, 171, 0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:shadow-[0_25px_50px_-15px_rgba(37,211,102,0.5)] transition-all duration-300 backdrop-blur-sm border border-white/20"
      style={{ 
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" strokeWidth={2} />
      
      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}
