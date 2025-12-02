import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import VideoBackground from './VideoBackground'
const Home = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Video/Image Background limpio - sin overlay */}
      <VideoBackground />
      
      {/* Degradado negro en la parte inferior del video */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
    </section>
  )
}

export default Home
