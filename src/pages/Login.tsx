import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Lock, User } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowForgotPassword(true)
    setRecoveryEmail(email) // Pre-llenar con el email del login si existe
  }

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setEmailSent(true)
    setIsSubmitting(false)
  }

  const closeForgotPassword = () => {
    setShowForgotPassword(false)
    setRecoveryEmail('')
    setEmailSent(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center px-4 md:px-6">
          <CardTitle className="text-2xl md:text-3xl font-bold">POS System</CardTitle>
          <p className="text-sm md:text-base text-gray-500">Ingresa tus credenciales para continuar</p>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Usuario o Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a 
                href="#" 
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" className="w-full text-base" size="lg">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Recuperación de Contraseña */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 py-8">
            <Card className="w-full max-w-md my-auto">
              <CardHeader className="relative">
                <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
                <button
                  onClick={closeForgotPassword}
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
                  {!emailSent ? (
                    <>
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Ingresa tu dirección de correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                        </p>
                      </div>

                      <form onSubmit={handlePasswordRecovery} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="recovery-email" className="text-sm font-medium text-gray-700">
                            Correo Electrónico
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="recovery-email"
                              type="email"
                              placeholder="correo@ejemplo.com"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeForgotPassword}
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Enviando...' : 'Enviar Instrucciones'}
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          ¡Email Enviado Exitosamente!
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Hemos enviado las instrucciones para restablecer tu contraseña a:
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="font-medium text-blue-600">{recoveryEmail}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Por favor revisa tu bandeja de entrada y sigue los pasos indicados.
                        </p>
                      </div>
                      <Button
                        onClick={closeForgotPassword}
                        className="w-full"
                      >
                        Entendido
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
