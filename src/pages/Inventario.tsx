import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, AlertTriangle } from 'lucide-react'

interface InventoryItem {
  id: number
  name: string
  sku: string
  currentStock: number
  minStock: number
  lastUpdate: string
}

export function Inventario() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [inventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Laptop HP Pavilion', sku: 'LAP-001', currentStock: 15, minStock: 10, lastUpdate: '2024-02-05' },
    { id: 2, name: 'Mouse Logitech MX', sku: 'MOU-002', currentStock: 50, minStock: 20, lastUpdate: '2024-02-06' },
    { id: 3, name: 'Teclado Mecánico', sku: 'KEY-003', currentStock: 30, minStock: 15, lastUpdate: '2024-02-04' },
    { id: 4, name: 'Monitor Samsung 27"', sku: 'MON-004', currentStock: 8, minStock: 15, lastUpdate: '2024-02-03' },
    { id: 5, name: 'Webcam Logitech C920', sku: 'WEB-005', currentStock: 5, minStock: 10, lastUpdate: '2024-02-02' },
  ])

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedProduct(item)
    setShowModal(true)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Control de Inventario</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Gestiona el stock de tus productos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{inventory.length}</p>
              </div>
              <div className="bg-blue-500 p-2 md:p-3 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-xl md:text-2xl font-bold text-red-600 mt-1 md:mt-2">
                  {inventory.filter(item => item.currentStock < item.minStock).length}
                </p>
              </div>
              <div className="bg-red-500 p-2 md:p-3 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">Stock Óptimo</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1 md:mt-2">
                  {inventory.filter(item => item.currentStock >= item.minStock).length}
                </p>
              </div>
              <div className="bg-green-500 p-2 md:p-3 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-3">
            {filteredInventory.map((item) => {
              const isLowStock = item.currentStock < item.minStock
              const stockPercentage = (item.currentStock / item.minStock) * 100

              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.sku}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isLowStock ? 'Stock Bajo' : 'Stock OK'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Stock Actual</p>
                      <p className={`text-xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                        {item.currentStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stock Mínimo</p>
                      <p className="text-xl font-bold text-gray-900">{item.minStock}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Última actualización: {item.lastUpdate}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustStock(item)}
                    className="w-full"
                  >
                    Ajustar Stock
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Stock Actual</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Stock Mínimo</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Última Actualización</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const isLowStock = item.currentStock < item.minStock
                  const stockPercentage = (item.currentStock / item.minStock) * 100

                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-600">{item.sku}</td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{item.name}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">{item.minStock}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {isLowStock ? 'Stock Bajo' : 'Stock OK'}
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.lastUpdate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdjustStock(item)}
                            className="min-h-[2.5rem] px-3 py-2 text-sm"
                          >
                            Ajustar Stock
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-md">
              <CardHeader className="relative">
                <CardTitle>Ajustar Stock - {selectedProduct.name}</CardTitle>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent>
              <form className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Stock Actual</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{selectedProduct.currentStock}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de Movimiento</label>
                    <select className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white">
                      <option>Entrada (Agregar)</option>
                      <option>Salida (Restar)</option>
                      <option>Ajuste Manual</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cantidad</label>
                    <Input type="number" placeholder="0" min="0" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Motivo</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white min-h-[80px]"
                      placeholder="Describe el motivo del ajuste..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Confirmar Ajuste
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </div>
  )
}
