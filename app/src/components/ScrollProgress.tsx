import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0
      setProgress(Math.min(pct, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[1000]"
      style={{
        width: `${progress}%`,
        backgroundColor: '#B8941F',
        boxShadow: '0 0 8px rgba(184, 148, 31, 0.4)',
        transition: 'width 0.1s linear',
      }}
    />
  )
}