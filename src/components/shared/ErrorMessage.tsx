import React from 'react';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
  onRetry?: () => void;
  onDismiss?: () => void;
  fullWidth?: boolean;
}

export default function ErrorMessage({
  title,
  message,
  variant = 'error',
  icon,
  onRetry,
  onDismiss,
  fullWidth = false,
}: ErrorMessageProps) {
  // Variantes de color
  const variants = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const config = variants[variant];

  // Iconos por defecto según variante
  const defaultIcons = {
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`
        ${config.bg}
        ${config.border}
        border
        rounded-xl
        p-4
        ${fullWidth ? 'w-full' : ''}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex items-start gap-3">
        {/* Icono */}
        <div className={`flex-shrink-0 ${config.icon}`}>
          {icon || defaultIcons[variant]}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold ${config.text} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${config.text}`}>
            {message}
          </p>

          {/* Botones de acción */}
          {(onRetry || onDismiss) && (
            <div className="flex items-center gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    ${config.button}
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                    transition-colors
                    duration-200
                  `.trim().replace(/\s+/g, ' ')}
                >
                  Reintentar
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`
                    text-sm
                    font-medium
                    ${config.text}
                    hover:underline
                  `.trim().replace(/\s+/g, ' ')}
                >
                  Descartar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Botón de cerrar (solo si hay onDismiss) */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${config.icon} hover:opacity-70 transition-opacity`}
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ===== ERROR SIMPLE (inline) =====

export interface SimpleErrorProps {
  message: string;
  className?: string;
}

export function SimpleError({ message, className = '' }: SimpleErrorProps) {
  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ===== ERROR FULL PAGE =====

export interface ErrorPageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorPage({
  title = 'Algo salió mal',
  message,
  onRetry,
  onGoBack,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icono grande */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          )}
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors duration-200"
            >
              Volver atrás
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== ERROR TOAST (notificación flotante) =====

export interface ErrorToastProps {
  message: string;
  onDismiss?: () => void;
  duration?: number;
}

export function ErrorToast({
  message,
  onDismiss,
  duration = 5000,
}: ErrorToastProps) {
  React.useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-md">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-medium flex-1">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="hover:opacity-70 transition-opacity"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ===== EMPTY STATE (estado vacío con opción de error) =====

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mb-4 flex justify-center text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}