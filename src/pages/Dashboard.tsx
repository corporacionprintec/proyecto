import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'

export function Dashboard() {
  const stats = [
    {
      title: 'Ventas del Día',
      value: '$12,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Productos en Stock',
      value: '1,234',
      change: '-3.2%',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Transacciones',
      value: '89',
      change: '+8.1%',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Ganancia Neta',
      value: '$4,890',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  const recentSales = [
    { id: 1, product: 'Laptop HP', amount: '$899', time: 'Hace 5 min' },
    { id: 2, product: 'Mouse Logitech', amount: '$45', time: 'Hace 12 min' },
    { id: 3, product: 'Teclado Mecánico', amount: '$120', time: 'Hace 23 min' },
    { id: 4, product: 'Monitor Samsung', amount: '$350', time: 'Hace 1 hora' },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Resumen general de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{stat.value}</p>
                  <p className={`text-xs md:text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs ayer
                  </p>
                </div>
                <div className={`${stat.color} p-2 md:p-3 rounded-lg flex-shrink-0`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{sale.product}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                  <p className="font-semibold text-green-600">{sale.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Cable HDMI', stock: 5, min: 20 },
                { name: 'Auriculares Bluetooth', stock: 8, min: 15 },
                { name: 'Cargador USB-C', stock: 12, min: 25 },
                { name: 'Adaptador Lightning', stock: 3, min: 10 },
              ].map((product, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(product.stock / product.min) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{product.stock} unidades</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
