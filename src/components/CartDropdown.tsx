import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus } from 'lucide-react'

export function CartDropdown() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm" style={{ color: '#7A7265' }}>
          Ihr Warenkorb ist leer
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 max-w-sm">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-start p-3 rounded border"
            style={{ borderColor: 'rgba(184, 148, 31, 0.2)' }}
          >
            <div className="flex-1">
              <h4 className="font-medium" style={{ color: '#1A1714' }}>
                {item.name}
              </h4>
              <p className="text-sm" style={{ color: '#B8941F' }}>
                {item.price} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus size={16} style={{ color: '#B8941F' }} />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus size={16} style={{ color: '#B8941F' }} />
              </button>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="p-1 hover:bg-red-50 rounded ml-1"
              >
                <Trash2 size={16} style={{ color: '#B8941F' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="pt-3 border-t"
        style={{ borderColor: 'rgba(184, 148, 31, 0.2)' }}
      >
        <div className="flex justify-between mb-4">
          <span style={{ color: '#1A1714' }}>Gesamtbetrag:</span>
          <span className="font-medium" style={{ color: '#B8941F' }}>
            €{total.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <a
          href="#checkout"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#checkout')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="block w-full py-2.5 text-center text-sm font-medium rounded"
          style={{
            backgroundColor: '#B8941F',
            color: '#F8F5EF',
          }}
        >
          Zur Kasse
        </a>
      </div>
    </div>
  )
}
