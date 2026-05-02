import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './sections/Preloader'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import Origin from './sections/Origin'
import Products from './sections/Products'
import Quality from './sections/Quality'
import Philosophy from './sections/Philosophy'
import Footer from './sections/Footer'
import ScrollProgress from './components/ScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && lenisRef.current) {
      lenisRef.current.start()
    } else if (isLoading && lenisRef.current) {
      lenisRef.current.stop()
    }
  }, [isLoading])

  const handlePreloaderComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero isLoading={isLoading} />
        <Origin />
        <Products />
        <Quality />
        <Philosophy />
      </main>
      <Footer />
    </>
  )
}