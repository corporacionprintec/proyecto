import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote } from 'lucide-react'

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

export function Ventas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')

  const products: Product[] = [
    { id: 1, name: 'Laptop HP Pavilion', sku: 'LAP-001', price: 899, stock: 15 },
    { id: 2, name: 'Mouse Logitech MX', sku: 'MOU-002', price: 45, stock: 50 },
    { id: 3, name: 'Teclado Mecánico', sku: 'KEY-003', price: 120, stock: 30 },
    { id: 4, name: 'Monitor Samsung 27"', sku: 'MON-004', price: 350, stock: 20 },
    { id: 5, name: 'Webcam Logitech C920', sku: 'WEB-005', price: 89, stock: 25 },
    { id: 6, name: 'Auriculares Sony', sku: 'AUD-006', price: 150, stock: 40 },
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
        setLastAddedItem(product.name)
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
      setLastAddedItem(product.name)
    }
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) return item
        if (newQuantity > item.stock) return item
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handleCompleteSale = () => {
    const message = paymentMethod === 'cash' 
      ? `¡Venta completada exitosamente!\nMétodo: Efectivo\nTotal: $${total.toFixed(2)}`
      : `¡Venta completada exitosamente!\nMétodo: Tarjeta\nTotal: $${total.toFixed(2)}`
    
    alert(message)
    setCart([])
    setShowCheckout(false)
    setPaymentMethod('card')
    setLastAddedItem(null)
  }

  const handleCloseCheckout = () => {
    setShowCheckout(false)
    setPaymentMethod('card')
  }

  // Limpiar el feedback del último producto agregado después de 2 segundos
  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        setLastAddedItem(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastAddedItem])

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Punto de Venta</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Registra nuevas ventas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {filteredProducts.map((product) => {
                  const isInCart = cart.some(item => item.id === product.id)
                  const cartItem = cart.find(item => item.id === product.id)
                  const isLastAdded = lastAddedItem === product.name
                  
                  return (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`
                        border rounded-lg p-3 md:p-4 transition-all cursor-pointer relative
                        ${isInCart ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'}
                        ${isLastAdded ? 'ring-2 ring-green-400 ring-offset-2' : ''}
                      `}
                    >
                      {isInCart && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {cartItem?.quantity || 1}
                        </div>
                      )}
                      <div className={`aspect-square rounded-md mb-2 md:mb-3 flex items-center justify-center ${
                        isInCart ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <ShoppingCart className={`w-8 h-8 md:w-12 md:h-12 ${isInCart ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className="font-medium text-gray-900 text-xs md:text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-base md:text-lg font-bold text-blue-600">${product.price}</p>
                        <p className={`text-xs ${isInCart ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                          {isInCart ? `En carrito (${cartItem?.quantity})` : `Stock: ${product.stock}`}
                        </p>
                      </div>
                      {isLastAdded && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="h-full w-full bg-green-500 opacity-20 animate-pulse rounded-lg" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
                Carrito de Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm md:text-base text-gray-500">El carrito está vacío</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto space-y-2 md:space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-2 md:p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs md:text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.sku}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 md:gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 md:w-7 md:h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <span className="w-6 md:w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 md:w-7 md:h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm md:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (16%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Procesar Pago
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-md">
              <CardHeader className="relative">
                <CardTitle>Procesar Pago</CardTitle>
                <button
                  onClick={handleCloseCheckout}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total a Pagar</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">${total.toFixed(2)}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Método de Pago</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-900'}`}>
                        Tarjeta
                      </span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-green-500 bg-green-50 hover:bg-green-100'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-green-900' : 'text-gray-900'}`}>
                        Efectivo
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Monto Recibido</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    defaultValue={total.toFixed(2)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Notas (Opcional)</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white min-h-[60px] text-sm"
                    placeholder="Agregar notas sobre la venta..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseCheckout}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCompleteSale}
                    className="flex-1"
                  >
                    Completar Venta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </div>
  )
}
