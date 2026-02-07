import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

interface Product {
  id: number
  name: string
  sku: string
  cost: number
  price: number
  stock: number
  category: string
  image?: string
}

export function Productos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categories, setCategories] = useState<string[]>(['Computadoras', 'Accesorios', 'Monitores'])
  const [newCategory, setNewCategory] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [products] = useState<Product[]>([
    { id: 1, name: 'Laptop HP Pavilion', sku: 'LAP-001', cost: 650, price: 899, stock: 15, category: 'Computadoras' },
    { id: 2, name: 'Mouse Logitech MX', sku: 'MOU-002', cost: 30, price: 45, stock: 50, category: 'Accesorios' },
    { id: 3, name: 'Teclado Mecánico', sku: 'KEY-003', cost: 85, price: 120, stock: 30, category: 'Accesorios' },
    { id: 4, name: 'Monitor Samsung 27"', sku: 'MON-004', cost: 250, price: 350, stock: 20, category: 'Monitores' },
    { id: 5, name: 'Webcam Logitech C920', sku: 'WEB-005', cost: 60, price: 89, stock: 25, category: 'Accesorios' },
  ])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNewProduct = () => {
    setSelectedProduct(null)
    setProductImage(null)
    setShowModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductImage(product.image || null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setProductImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const processImageFile = (file: File) => {
    // En un sistema real, aquí subirías la imagen a un servidor
    // Por ahora, creamos una URL local para previsualización
    const reader = new FileReader()
    reader.onloadend = () => {
      setProductImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        processImageFile(file)
      }
    }
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar el producto
    console.log('Producto eliminado:', productToDelete?.name)
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const handleAddCategory = () => {
    setShowCategoryModal(true)
    setNewCategory('')
  }

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCategory = newCategory.trim()
    
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories([...categories, trimmedCategory])
      setShowCategoryModal(false)
      setNewCategory('')
      
      // Actualizar el select del modal de producto para incluir la nueva categoría
      setTimeout(() => {
        const selectElement = document.querySelector('select') as HTMLSelectElement
        if (selectElement && !selectElement.value) {
          selectElement.value = trimmedCategory
        }
      }, 0)
    }
  }

  const closeCategoryModal = () => {
    setShowCategoryModal(false)
    setNewCategory('')
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Administra tu catálogo de productos</p>
        </div>
        <Button onClick={handleNewProduct} className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          <span className="sm:inline">Nuevo Producto</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm md:text-base"
              />
            </div>
            <select className="h-10 px-4 rounded-md border border-gray-300 bg-white text-sm">
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Vista Cards-Tabla Responsive */}
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                {/* Mobile: Card Layout */}
                <div className="p-4 sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Costo</p>
                      <p className="text-lg font-bold text-gray-700">${product.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Precio</p>
                      <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Margen</p>
                      <p className="text-lg font-bold text-green-600">
                        ${((product.price - product.cost).toFixed(2))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className={`text-lg font-bold ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 min-w-0 text-xs px-2 py-2" 
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Editar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 min-w-0 text-xs px-2 py-2" 
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash2 className="w-3 h-3 mr-1 flex-shrink-0 text-red-600" />
                      <span className="truncate">Eliminar</span>
                    </Button>
                  </div>
                </div>

                {/* Desktop: Table Row Layout */}
                <div className="hidden sm:flex items-center p-3 lg:p-4">
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-8 gap-2 lg:gap-4 items-center">
                      {/* SKU */}
                      <div className="text-xs lg:text-sm text-gray-600 truncate">
                        {product.sku}
                      </div>
                      
                      {/* Producto */}
                      <div className="col-span-2 min-w-0">
                        <p className="font-medium text-gray-900 text-xs lg:text-sm truncate">
                          {product.name}
                        </p>
                      </div>
                      
                      {/* Categoría */}
                      <div className="hidden lg:block">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Costo */}
                      <div className="text-right font-medium text-gray-700 text-xs lg:text-sm">
                        ${product.cost.toFixed(2)}
                      </div>
                      
                      {/* Precio */}
                      <div className="text-right font-medium text-gray-900 text-xs lg:text-sm">
                        ${product.price.toFixed(2)}
                      </div>
                      
                      {/* Margen */}
                      <div className="text-right font-medium text-green-600 text-xs lg:text-sm">
                        ${(product.price - product.cost).toFixed(2)}
                      </div>
                      
                      {/* Stock */}
                      <div className="text-right">
                        <span className={`font-medium text-xs lg:text-sm ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center justify-center gap-1 lg:gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-2xl">
              <CardHeader className="relative">
                <CardTitle>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <Input 
                      type="text" 
                      placeholder="Ej: Laptop HP Pavilion" 
                      defaultValue={selectedProduct?.name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <Input 
                      type="text" 
                      placeholder="Ej: LAP-001" 
                      defaultValue={selectedProduct?.sku || ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 h-10 px-3 rounded-md border border-gray-300 bg-white"
                      defaultValue={selectedProduct?.category || ''}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleAddCategory}
                      className="h-10 px-3"
                      title="Agregar nueva categoría"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Selecciona una categoría existente o crea una nueva haciendo clic en +
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Costo de Adquisición</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        className="pl-7"
                        defaultValue={selectedProduct?.cost || ''}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Lo que te costó comprarlo</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Precio de Venta</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        className="pl-7"
                        defaultValue={selectedProduct?.price || ''}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Lo que cobrarás al cliente</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Stock {selectedProduct ? 'Actual' : 'Inicial'}</label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      defaultValue={selectedProduct?.stock || ''}
                    />
                    <p className="text-xs text-gray-500">Cantidad disponible</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white min-h-[100px]"
                    placeholder="Descripción del producto..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Imagen del Producto</label>
                  <div className="flex items-start gap-4">
                    <div 
                      className={`
                        w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all
                        ${isDragging 
                          ? 'border-blue-500 bg-blue-50' 
                          : productImage 
                            ? 'border-gray-300 bg-white' 
                            : 'border-gray-300 bg-gray-50'
                        }
                        ${!productImage ? 'cursor-pointer' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={!productImage ? () => document.getElementById('image-upload')?.click() : undefined}
                    >
                      {productImage ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={productImage} 
                            alt="Vista previa" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-2">
                          {isDragging ? (
                            <>
                              <svg className="w-12 h-12 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-xs text-blue-600 font-medium">Suelta para subir</p>
                            </>
                          ) : (
                            <>
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">Arrastra imagen</p>
                              <p className="text-xs text-gray-400">o haz clic</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Seleccionar Imagen
                      </label>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Arrastra y suelta una imagen aquí</p>
                        <p>• Formatos: JPG, PNG, GIF. Máximo 5MB.</p>
                        {productImage && (
                          <p className="text-green-600">✓ Imagen cargada</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {selectedProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-md my-auto">
              <CardHeader className="relative">
                <CardTitle className="text-red-600">Confirmar Eliminación</CardTitle>
                <button
                  onClick={cancelDelete}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ¿Estás seguro de eliminar este producto?
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Esta acción no es reversible y eliminará permanentemente el producto del sistema.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Producto:</span>
                        <span className="font-medium">{productToDelete.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SKU:</span>
                        <span className="font-medium">{productToDelete.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock Actual:</span>
                        <span className="font-medium">{productToDelete.stock} unidades</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={cancelDelete} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                      Eliminar Producto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de Crear Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-md my-auto">
              <CardHeader className="relative">
                <CardTitle>Nueva Categoría</CardTitle>
                <button
                  onClick={closeCategoryModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="category-name" className="text-sm font-medium text-gray-700">
                      Nombre de la Categoría
                    </label>
                    <Input
                      id="category-name"
                      type="text"
                      placeholder="Ej: Impresoras, Audio, Gaming..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Ingresa un nombre descriptivo para la nueva categoría de productos.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Categorías existentes:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeCategoryModal}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                    >
                      Crear Categoría
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
