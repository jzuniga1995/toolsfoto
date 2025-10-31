'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(() => {
    // Solo se ejecuta una vez en el cliente, nunca en el servidor
    if (typeof window === 'undefined') return false
    const cookiesAccepted = localStorage.getItem('cookies-accepted')
    return !cookiesAccepted
  })

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookies-accepted', 'rejected')
    setShowBanner(false)
    // Aquí podrías desactivar Google Analytics u otras cookies no esenciales
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-gray-200 shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y mostrar publicidad personalizada. 
                  <span className="font-semibold"> Tus imágenes nunca se almacenan ni rastrean.</span>
                  {' '}
                  <Link href="/politica-cookies" className="text-blue-600 hover:text-blue-700 underline">
                    Más información
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={rejectCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Solo necesarias
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}