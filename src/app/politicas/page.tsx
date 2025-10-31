export default function PoliticasPrivacidad() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-gray-800 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Políticas de Privacidad
            </h1>
            <p className="text-xl text-slate-200">
              Tu privacidad es nuestra prioridad
            </p>
          </div>

          <div className="px-8 py-10 space-y-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-green-600 mr-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold text-green-800 mb-2">
                    Procesamiento 100% Local
                  </h2>
                  <p className="text-green-700">
                    Todas las operaciones de edición de imágenes se realizan completamente en tu navegador. Tus fotos nunca se suben a ningún servidor ni salen de tu dispositivo.
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Información que NO Recopilamos
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>ToolsFoto NO recopila, almacena ni procesa ninguna de las siguientes informaciones:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Tus imágenes o archivos que editas</li>
                  <li>Datos personales identificables</li>
                  <li>Información de cuenta (no requerimos registro)</li>
                  <li>Contenido de tus ediciones</li>
                  <li>Historial de uso de herramientas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Cómo Funciona Nuestra Tecnología
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Todas las herramientas de ToolsFoto funcionan mediante tecnología de procesamiento del lado del cliente (client-side processing):
                </p>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">1.</span>
                    <p>Cargas tu imagen desde tu dispositivo</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">2.</span>
                    <p>La imagen se procesa directamente en tu navegador usando JavaScript</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">3.</span>
                    <p>Los resultados se generan en tu dispositivo</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">4.</span>
                    <p>Descargas el resultado directamente a tu equipo</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  En ningún momento tus imágenes son enviadas a nuestros servidores o a terceros.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Cookies y Almacenamiento Local
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  ToolsFoto puede utilizar cookies y almacenamiento local del navegador únicamente para:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Recordar tus preferencias de configuración (tema, idioma, etc.)</li>
                  <li>Mejorar la experiencia de usuario</li>
                  <li>Análisis anónimo de uso del sitio mediante herramientas como Google Analytics</li>
                </ul>
                <p className="font-medium">
                  Importante: Las cookies NO se utilizan para rastrear tus imágenes ni el contenido que editas.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Servicios de Terceros
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  Podemos utilizar servicios de terceros para análisis y mejora del sitio:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Para entender el uso general del sitio (páginas visitadas, tiempo de permanencia, etc.)</li>
                  <li><strong>Servicios de hosting:</strong> Para alojar el código de la aplicación web</li>
                </ul>
                <p>
                  Estos servicios pueden recopilar datos anónimos de navegación, pero nunca tienen acceso a las imágenes que procesas.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Seguridad
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  La seguridad de tus datos es inherente a nuestro diseño:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Todo el procesamiento ocurre en tu dispositivo</li>
                  <li>Usamos conexiones HTTPS seguras</li>
                  <li>No almacenamos ninguna imagen en servidores</li>
                  <li>No hay base de datos de usuarios o contenido</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Herramientas con IA
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  Algunas herramientas utilizan inteligencia artificial (como eliminar fondo o pixelar rostros):
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Los modelos de IA se ejecutan completamente en tu navegador</li>
                  <li>No se envían imágenes a APIs externas de IA</li>
                  <li>Todo el procesamiento es local y privado</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Tus Derechos
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  Como no recopilamos datos personales ni imágenes, tienes control total sobre tu información:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No necesitas solicitar eliminación de datos (no los almacenamos)</li>
                  <li>Puedes limpiar cookies y almacenamiento local desde tu navegador en cualquier momento</li>
                  <li>Tienes control completo sobre qué imágenes procesas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Menores de Edad
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  ToolsFoto es seguro para usuarios de todas las edades. No recopilamos información personal de ningún usuario, incluidos menores de edad. Los padres pueden estar tranquilos sabiendo que sus hijos pueden usar nuestras herramientas sin riesgo de exposición de datos.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. Cambios a Esta Política
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  Podemos actualizar esta política ocasionalmente. Cualquier cambio será publicado en esta página con la fecha de última actualización. Te recomendamos revisar esta política periódicamente.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Última actualización: Octubre 2025
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. Contacto
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  Si tienes preguntas sobre estas políticas de privacidad, puedes contactarnos a través de:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-800">Email:codezun@gmail.com</p>
                  <p className="text-sm text-gray-500 mt-2">(Actualiza este email con tu dirección de contacto real)</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Resumen Simple
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Tu privacidad está garantizada al 100%.</strong> Todas tus imágenes se procesan en tu navegador, nunca se suben a internet, y no recopilamos ningún dato personal. Es como usar un software instalado en tu computadora, pero desde tu navegador.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
