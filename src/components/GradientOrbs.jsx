import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * GradientOrbs Component
 * Orbes 3D generativos con WebGL
 * Efecto premium usado en sitios de Apple, Stripe
 * 
 * Requiere: npm install three
 */
const GradientOrbs = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Crear orbes con gradientes
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    
    const orbs = []
    const colors = [
      { start: '#a855f7', end: '#9333ea' }, // Purple
      { start: '#d946ef', end: '#c026d3' }, // Fuchsia
      { start: '#06b6d4', end: '#0891b2' }, // Cyan
    ]

    colors.forEach((color, i) => {
      const material = new THREE.MeshPhongMaterial({
        color: color.start,
        emissive: color.end,
        emissiveIntensity: 0.5,
        shininess: 100,
        transparent: true,
        opacity: 0.6,
      })

      const orb = new THREE.Mesh(geometry, material)
      orb.position.x = (i - 1) * 3
      orb.position.y = Math.sin(i * 0.5) * 2
      orb.scale.set(0.8, 0.8, 0.8)
      
      scene.add(orb)
      orbs.push({ mesh: orb, speed: 0.001 + i * 0.0003 })
    })

    // Luces
    const light1 = new THREE.PointLight(0xa855f7, 2, 100)
    light1.position.set(10, 10, 10)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xd946ef, 2, 100)
    light2.position.set(-10, -10, 10)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Mouse interaction
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      orbs.forEach((orb, i) => {
        orb.mesh.rotation.x += orb.speed
        orb.mesh.rotation.y += orb.speed * 1.5
        
        // Mouse parallax
        orb.mesh.position.x += (mouse.x * 2 - orb.mesh.position.x) * 0.02
        orb.mesh.position.y += (mouse.y * 2 - orb.mesh.position.y) * 0.02
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 -z-10"
      style={{ filter: 'blur(80px)' }}
    />
  )
}

export default GradientOrbs
