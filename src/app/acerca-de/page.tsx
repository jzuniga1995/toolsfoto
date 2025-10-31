import Link from 'next/link'

export default function AcercaDe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Acerca de ToolsFoto
            </h1>
            <p className="text-xl text-blue-100">
              Tu herramienta gratuita de edición de imágenes en línea
            </p>
          </div>

          <div className="px-8 py-10 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Qué es ToolsFoto?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                ToolsFoto es una plataforma web gratuita que te permite editar, modificar y optimizar tus imágenes directamente desde tu navegador. Sin necesidad de instalar software complicado ni de registrarte, puedes acceder a múltiples herramientas profesionales de edición de fotos en un solo lugar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Nuestras Herramientas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875l-2.25-2.25M12 13.875V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Comprimir</h3>
                    <p className="text-sm text-gray-600">Reduce el tamaño de tus imágenes sin perder calidad visible</p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Redimensionar</h3>
                    <p className="text-sm text-gray-600">Cambia las dimensiones de tus imágenes por píxeles o porcentaje</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-.75m0-12h-7.5m7.5 0v7.5m0-7.5l-7.5 7.5" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Recortar</h3>
                    <p className="text-sm text-gray-600">Recorta tus imágenes definiendo un área específica</p>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Convertir</h3>
                    <p className="text-sm text-gray-600">Convierte entre PNG, JPG, WEBP, GIF y más formatos</p>
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Girar</h3>
                    <p className="text-sm text-gray-600">Rota tus imágenes 90°, 180°, 270° o cualquier ángulo</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Marca de Agua</h3>
                    <p className="text-sm text-gray-600">Protege tus imágenes añadiendo texto o logo como marca</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Crear Meme</h3>
                    <p className="text-sm text-gray-600">Añade texto superior e inferior para crear memes divertidos</p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Editor de Fotos</h3>
                    <p className="text-sm text-gray-600">Editor completo con filtros, ajustes, texto y más</p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Eliminar Fondo</h3>
                    <p className="text-sm text-gray-600">Remueve el fondo de tus imágenes automáticamente con IA</p>
                  </div>
                </div>

                <div className="bg-violet-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">HTML a Imagen</h3>
                    <p className="text-sm text-gray-600">Convierte código HTML a imagen PNG o JPG</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Pixelar Rostros</h3>
                    <p className="text-sm text-gray-600">Detecta y pixela automáticamente rostros en imágenes</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Por qué elegir ToolsFoto?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">100% Gratuito</h3>
                    <p className="text-gray-600">Todas nuestras herramientas son completamente gratis, sin límites ni suscripciones</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Privacidad Garantizada</h3>
                    <p className="text-gray-600">Tus imágenes se procesan localmente en tu navegador, no se suben a ningún servidor</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Fácil de Usar</h3>
                    <p className="text-gray-600">Interfaz intuitiva y simple, perfecta para principiantes y profesionales</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Sin Registro</h3>
                    <p className="text-gray-600">Comienza a editar inmediatamente, sin necesidad de crear una cuenta</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Creemos que las herramientas de edición de imágenes profesionales deben ser accesibles para todos. Nuestra misión es proporcionar una plataforma sencilla, rápida y gratuita que permita a cualquier persona editar sus fotos sin complicaciones, protegiendo siempre su privacidad.
              </p>
            </section>

            <section className="text-center pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-gray-600 mb-6">
                Explora nuestras herramientas y descubre lo fácil que es editar tus imágenes
              </p>
              <Link 
                href="/" 
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Ir a las Herramientas
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}