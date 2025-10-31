import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
  ...props
}: BadgeProps) {
  // Estilos base
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';

  // Variantes
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  // Tamaños
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  // Borde redondeado
  const borderRadius = rounded ? 'rounded-full' : 'rounded-md';

  // Color del dot según variante
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-blue-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-cyan-500',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${borderRadius}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={classes} {...props}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

// ===== BADGE CON ICONO =====

export interface IconBadgeProps extends BadgeProps {
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function IconBadge({
  icon,
  iconPosition = 'left',
  children,
  ...props
}: IconBadgeProps) {
  return (
    <Badge {...props}>
      {iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </Badge>
  );
}

// ===== BADGE CON BOTÓN DE CERRAR =====

export interface DismissibleBadgeProps extends BadgeProps {
  onDismiss?: () => void;
}

export function DismissibleBadge({
  children,
  onDismiss,
  ...props
}: DismissibleBadgeProps) {
  return (
    <Badge {...props}>
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 -mr-1 flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Cerrar"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </Badge>
  );
}

// ===== BADGE DE CONTADOR =====

export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export function CountBadge({
  count,
  max = 99,
  showZero = false,
  ...props
}: CountBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge {...props} rounded>
      {displayCount}
    </Badge>
  );
}

// ===== BADGE DE ESTADO =====

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'online' | 'offline' | 'away' | 'busy';
}

export function StatusBadge({
  status,
  children,
  ...props
}: StatusBadgeProps) {
  const statusConfig = {
    online: { variant: 'success' as const, label: 'En línea' },
    offline: { variant: 'default' as const, label: 'Desconectado' },
    away: { variant: 'warning' as const, label: 'Ausente' },
    busy: { variant: 'danger' as const, label: 'Ocupado' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot {...props}>
      {children || config.label}
    </Badge>
  );
}

// ===== BADGE OUTLINE (solo borde) =====

export interface OutlineBadgeProps extends BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export function OutlineBadge({
  variant = 'default',
  className = '',
  ...props
}: OutlineBadgeProps) {
  const outlineVariants = {
    default: 'border-gray-300 text-gray-700',
    primary: 'border-blue-500 text-blue-700',
    secondary: 'border-purple-500 text-purple-700',
    success: 'border-green-500 text-green-700',
    warning: 'border-yellow-500 text-yellow-700',
    danger: 'border-red-500 text-red-700',
    info: 'border-cyan-500 text-cyan-700',
  };

  return (
    <Badge
      className={`bg-transparent border ${outlineVariants[variant]} ${className}`}
      {...props}
    />
  );
}