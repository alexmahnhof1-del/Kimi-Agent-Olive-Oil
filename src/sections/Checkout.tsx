import { useRef, useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.checkout-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    clearCart()
    setTimeout(() => setSubmitted(false), 5000)
  }

  if (items.length === 0 && !submitted) return null

  return (
    <section
      id="checkout"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-20"
      style={{ backgroundColor: '#F8F5EF' }}
    >
      <div className="content-narrow relative z-10">
        <div className="checkout-content opacity-0 max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center">
              <h2
                className="font-display text-[48px] md:text-[56px] leading-[1.1] tracking-[-2px] mb-6"
                style={{ color: '#1A1714' }}
              >
                Danke! 🎉
              </h2>
              <p
                className="font-body text-base md:text-[17px] mb-4"
                style={{ color: '#7A7265' }}
              >
                Ihre Bestellung wurde erfolgreich aufgegeben.
              </p>
              <p
                className="font-body text-sm"
                style={{ color: '#B8941F' }}
              >
                Vielen Dank für Ihren Kauf!
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="text-center mb-8">
                <h2
                  className="font-display text-[40px] md:text-[56px] leading-[1.1] tracking-[-2px] mb-3"
                  style={{ color: '#1A1714' }}
                >
                  Kasse
                </h2>
                <p
                  className="font-body text-base"
                  style={{ color: '#7A7265' }}
                >
                  Bitte überprüfen Sie Ihre Bestellung
                </p>
              </div>

              {/* Order Summary */}
              <div
                className="p-6 md:p-8 rounded-lg border"
                style={{ borderColor: 'rgba(184, 148, 31, 0.2)', backgroundColor: '#FFFFFF' }}
              >
                <h3
                  className="font-display text-xl mb-6"
                  style={{ color: '#1A1714' }}
                >
                  Bestellübersicht
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: 'rgba(184, 148, 31, 0.2)' }}>
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span style={{ color: '#1A1714' }}>
                        {item.name} x {item.quantity}
                      </span>
                      <span
                        style={{ color: '#B8941F' }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-medium">
                  <span style={{ color: '#1A1714' }}>Gesamtbetrag:</span>
                  <span style={{ color: '#B8941F' }}>
                    €{total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Customer Details Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block font-body text-sm mb-2 uppercase tracking-[1px]"
                    style={{ color: '#1A1714' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded bg-white font-body"
                    style={{
                      borderColor: 'rgba(184, 148, 31, 0.2)',
                      color: '#1A1714',
                    }}
                    placeholder="Ihr Name"
                  />
                </div>

                <div>
                  <label
                    className="block font-body text-sm mb-2 uppercase tracking-[1px]"
                    style={{ color: '#1A1714' }}
                  >
                    E-Mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded bg-white font-body"
                    style={{
                      borderColor: 'rgba(184, 148, 31, 0.2)',
                      color: '#1A1714',
                    }}
                    placeholder="ihre@email.de"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 font-body text-sm uppercase tracking-[1.5px] font-medium rounded transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: '#B8941F',
                    color: '#F8F5EF',
                  }}
                >
                  Bestellung Abschließen
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
