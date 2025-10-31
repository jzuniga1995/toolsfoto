import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  ...props
}: CardProps) {
  // Estilos base
  const baseStyles = 'rounded-2xl transition-all duration-300';

  // Variantes
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-transparent border-2 border-gray-300',
    ghost: 'bg-gray-50',
  };

  // Padding
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Efectos hover
  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02]' : '';
  const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.98]' : '';

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverStyles}
    ${clickableStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// ===== SUB-COMPONENTES =====

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 flex items-center gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ===== CARD SIMPLE PARA HERRAMIENTAS =====

export interface ToolCardSimpleProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
  isNew?: boolean;
}

export function ToolCardSimple({
  icon,
  title,
  description,
  onClick,
  isNew = false,
}: ToolCardSimpleProps) {
  return (
    <Card
      variant="default"
      padding="md"
      hover
      clickable
      onClick={onClick}
      className="relative"
    >
      {isNew && (
        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Nuevo
        </span>
      )}

      <div className="flex flex-col items-start gap-3">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}