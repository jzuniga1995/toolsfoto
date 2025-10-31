'use client';

import { TOOLS, CATEGORIES } from '@/lib/constants';
import ToolCard from '@/components/tools/ToolCard';
import { Zap, Sparkles, Rocket, Check, Lock, Clock, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  // Agrupar herramientas por categoría
  const toolsByCategory = {
    basico: TOOLS.filter((tool) => tool.category === 'basico'),
    creativo: TOOLS.filter((tool) => tool.category === 'creativo'),
    avanzado: TOOLS.filter((tool) => tool.category === 'avanzado'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section para SEO */}
      <section className="relative py-8 md:py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 animate-bounce text-sm">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">100% Gratis • Sin Registro</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in">
              Herramientas Online
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                Gratuitas
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-blue-50 max-w-2xl mx-auto animate-fade-in-delay">
              {TOOLS.length} herramientas profesionales. Sin límites, sin complicaciones.
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }

          .animate-fade-in-delay {
            opacity: 0;
            animation: fade-in 0.8s ease-out 0.2s forwards;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </section>

      {/* Todas las Herramientas en una sección */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Todas las Herramientas
            </h2>
            <p className="text-gray-600 text-lg">
              Explora nuestra colección completa de herramientas organizadas por categoría
            </p>
          </div>

          {/* Herramientas Básicas */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Herramientas Básicas
            </h3>
            <p className="text-gray-600 mb-4">
              {CATEGORIES.basico.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolsByCategory.basico.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* Herramientas Creativas */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Herramientas Creativas
            </h3>
            <p className="text-gray-600 mb-4">
              {CATEGORIES.creativo.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolsByCategory.creativo.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* Herramientas Avanzadas */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-orange-600" />
              Herramientas Avanzadas
            </h3>
            <p className="text-gray-600 mb-4">
              {CATEGORIES.avanzado.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolsByCategory.avanzado.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>
{/* Contenido SEO Optimizado */}
<section className="py-12 bg-gray-50">
  <div className="container-custom">
    <article className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Herramientas Online Gratis para Editar Imágenes y Fotos en 2024
      </h2>
      
      <div className="prose max-w-none space-y-6">
        <p className="text-gray-700 text-lg leading-relaxed">
          Descubre la colección más completa de <strong>herramientas online gratuitas para editar imágenes</strong> diseñadas 
          para fotógrafos, diseñadores y creativos. Todas nuestras herramientas funcionan directamente en tu navegador, 
          sin necesidad de descargar software como Photoshop o instalar aplicaciones. Edita tus fotos de forma profesional, 
          rápida y 100% privada.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 my-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Award className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-gray-900 mb-2">100% Gratis</h3>
            <p className="text-sm text-gray-600">Sin costos ocultos, sin suscripciones, sin marcas de agua en tus imágenes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Zap className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-bold text-gray-900 mb-2">Procesamiento Instantáneo</h3>
            <p className="text-sm text-gray-600">Resultados en segundos, edición en tiempo real sin esperas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Lock className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 mb-2">Privacidad Total</h3>
            <p className="text-sm text-gray-600">Tus fotos nunca se suben a servidores, todo se procesa localmente</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          ¿Por qué usar nuestras herramientas para editar fotos online?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Nuestras <strong>herramientas de edición de imágenes online</strong> están optimizadas para ofrecerte 
          resultados profesionales sin la complejidad de software como Adobe Photoshop. Ya sea que necesites 
          comprimir imágenes para tu sitio web, recortar fotos para redes sociales, convertir formatos, 
          o aplicar efectos creativos, tenemos la herramienta perfecta que funciona directamente en tu navegador.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Herramientas de edición de imágenes disponibles
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Herramientas básicas</strong> - Comprimir, redimensionar, recortar, convertir formato y rotar imágenes. Esenciales para optimizar fotos para web y redes sociales.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Herramientas creativas</strong> - Crear memes, agregar marcas de agua, pixelar áreas sensibles y aplicar efectos artísticos. Perfectas para contenido viral y protección de imágenes.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Herramientas avanzadas</strong> - Convertir HTML a imagen para diseñadores y desarrolladores. Soluciones profesionales sin necesidad de software costoso.</span>
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Casos de uso profesionales
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Nuestras herramientas son utilizadas por profesionales de diferentes industrias:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Desarrolladores web:</strong> Optimizan imágenes para mejorar PageSpeed y Core Web Vitals, crucial para SEO y experiencia de usuario.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Diseñadores gráficos:</strong> Convierten formatos, redimensionan y comprimen imágenes para diferentes medios sin abrir Photoshop.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Social media managers:</strong> Crean contenido visual optimizado para Instagram, Facebook, Twitter y TikTok con las dimensiones exactas.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Fotógrafos:</strong> Procesan lotes de fotos, agregan marcas de agua para proteger derechos de autor y crean versiones web de alta resolución.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>Bloggers y creadores:</strong> Optimizan imágenes destacadas, crean memes virales y preparan contenido visual atractivo.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span><strong>E-commerce:</strong> Unifican tamaños de productos, comprimen imágenes de catálogo y convierten a formatos modernos como WebP.</span>
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Ventajas sobre software de escritorio
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          A diferencia de software como Photoshop, GIMP o Lightroom, nuestras herramientas ofrecen:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Sin instalación:</strong> Funciona en cualquier dispositivo con navegador web, sin ocupar espacio en disco.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Sin curva de aprendizaje:</strong> Interfaz intuitiva vs la complejidad de Photoshop con miles de funciones.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Gratis para siempre:</strong> Adobe Photoshop cuesta más de 20 USD mensuales, nuestras herramientas son 100% gratuitas.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Multiplataforma:</strong> Windows, Mac, Linux, tablets y móviles - funciona en todos.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Actualizaciones automáticas:</strong> Siempre tienes la última versión sin necesidad de descargar updates.</span>
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Optimización de imágenes para SEO
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Las imágenes optimizadas son fundamentales para el SEO moderno. Google PageSpeed Insights y Core Web Vitals 
          penalizan sitios con imágenes pesadas o mal optimizadas. Nuestras herramientas te ayudan a:
        </p>
        <ul className="space-y-2 text-gray-700 mt-3">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Comprimir imágenes hasta un 90% sin pérdida visible de calidad</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Convertir a formatos modernos como WebP para carga 30% más rápida</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Redimensionar a las dimensiones exactas necesarias evitando desperdicio de ancho de banda</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Mejorar LCP (Largest Contentful Paint) y reducir tasa de rebote</span>
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Privacidad y seguridad garantizadas
        </h3>
        <p className="text-gray-700 leading-relaxed">
          A diferencia de otras herramientas online que suben tus imágenes a sus servidores, nosotros procesamos 
          todo localmente en tu navegador. Esto significa que:
        </p>
        <ul className="space-y-2 text-gray-700 mt-3">
          <li className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Tus fotos personales, documentos confidenciales e imágenes privadas nunca salen de tu dispositivo</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>No almacenamos, analizamos ni compartimos tus imágenes con terceros</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Cumplimiento total con GDPR y regulaciones de privacidad internacionales</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Funciona incluso sin conexión a internet una vez cargada la página</span>
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Compatible con todos los formatos populares
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Trabajamos con los formatos de imagen más utilizados: <strong>JPG/JPEG, PNG, WebP, GIF y BMP</strong>. 
          Puedes subir imágenes de hasta 50MB, suficiente para procesar fotos de cámaras DSLR profesionales, 
          scans de alta resolución y exports de software de diseño. Todas las herramientas mantienen la máxima 
          calidad posible durante el procesamiento.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Funciona en cualquier dispositivo
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Ya sea que uses <strong>Windows, Mac, Linux, iPhone, iPad o Android</strong>, nuestras herramientas 
          están optimizadas para funcionar perfectamente en cualquier dispositivo moderno. La interfaz responsive 
          se adapta automáticamente a pantallas de escritorio, tablets y móviles, ofreciendo la mejor experiencia 
          posible en cada tamaño de pantalla.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Comienza ahora mismo</h4>
              <p className="text-gray-700 mb-3">
                Todas nuestras herramientas son completamente gratuitas y no requieren registro. 
                Simplemente elige la herramienta que necesitas de las categorías arriba y comienza a editar tus 
                imágenes inmediatamente. Sin límites de uso, sin anuncios intrusivos, sin complicaciones.
              </p>
              <p className="text-gray-700">
                <strong>¿Eres nuevo?</strong> Te recomendamos empezar con nuestras herramientas básicas como 
                Comprimir Imagen o Redimensionar Imagen. Son perfectas para aprender el flujo de trabajo y 
                ver la calidad de nuestros resultados. Después puedes explorar herramientas más avanzadas 
                según tus necesidades específicas.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Preguntas frecuentes
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Realmente es gratis o hay costos ocultos?</h4>
            <p className="text-gray-700 text-sm">
              Es 100% gratis sin ningún costo oculto. No hay planes premium, no hay límites de uso, 
              no hay marcas de agua en tus imágenes. Todas las funciones están disponibles sin pagar.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Necesito crear una cuenta o registrarme?</h4>
            <p className="text-gray-700 text-sm">
              No, absolutamente no. Todas las herramientas funcionan sin registro. Simplemente abre 
              la herramienta que necesitas y comienza a usarla inmediatamente.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Mis imágenes son privadas y seguras?</h4>
            <p className="text-gray-700 text-sm">
              Sí, completamente. Todo el procesamiento se hace en tu navegador. Tus imágenes nunca 
              se suben a nuestros servidores ni a ningún lugar en internet. Es tan privado como usar 
              software instalado en tu computadora.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Funciona sin internet?</h4>
            <p className="text-gray-700 text-sm">
              Una vez que cargas la página de una herramienta, puede funcionar offline en la mayoría 
              de casos. Sin embargo, necesitas conexión inicial para cargar la herramienta.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Hay límite en el tamaño de las imágenes?</h4>
            <p className="text-gray-700 text-sm">
              Puedes subir imágenes de hasta 50MB, que es suficiente para fotos de cámaras profesionales 
              y la mayoría de usos. El límite existe solo por razones técnicas del navegador.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">¿Pierden calidad mis imágenes al procesarlas?</h4>
            <p className="text-gray-700 text-sm">
              Depende de la herramienta y configuración. Herramientas como recortar y rotar mantienen 
              calidad perfecta. Comprimir y convertir a JPG tienen pérdida controlable que tú ajustas. 
              Siempre puedes configurar calidad máxima si lo prefieres.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 mt-8 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3 text-lg">💡 Consejo profesional</h4>
          <p className="text-gray-700 mb-3">
            Para obtener mejores resultados, combina múltiples herramientas en tu flujo de trabajo:
          </p>
          <ol className="text-gray-700 text-sm space-y-1 ml-4">
            <li>1. <strong>Recorta</strong> para mejorar la composición</li>
            <li>2. <strong>Redimensiona</strong> a las dimensiones necesarias</li>
            <li>3. <strong>Convierte</strong> al formato más eficiente (WebP para web)</li>
            <li>4. <strong>Comprime</strong> para reducir tamaño manteniendo calidad</li>
          </ol>
          <p className="text-gray-700 text-sm mt-3">
            Este flujo optimiza tus imágenes completamente para web, mejorando velocidad de carga 
            y SEO sin sacrificar calidad visual.
          </p>
        </div>
      </div>
    </article>
  </div>
</section>
    
    </div>
  );
}