import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
}: LoadingProps) {
  // Tamaños
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Colores
  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white',
  };

  const textColors = {
    primary: 'text-gray-600',
    secondary: 'text-gray-500',
    white: 'text-white',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'spinner' && (
        <div
          className={`
            ${sizes[size]}
            border-4
            ${colors[color]}
            border-t-transparent
            rounded-full
            animate-spin
          `.trim().replace(/\s+/g, ' ')}
        />
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-2">
          <div
            className={`
              ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
              bg-blue-600
              rounded-full
              animate-bounce
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={`
              ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
              bg-blue-600
              rounded-full
              animate-bounce
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={`
              ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
              bg-blue-600
              rounded-full
              animate-bounce
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      )}

      {variant === 'pulse' && (
        <div className="relative">
          <div
            className={`
              ${sizes[size]}
              bg-blue-600
              rounded-full
              animate-ping
              absolute
              inset-0
            `.trim().replace(/\s+/g, ' ')}
          />
          <div
            className={`
              ${sizes[size]}
              bg-blue-600
              rounded-full
              relative
            `.trim().replace(/\s+/g, ' ')}
          />
        </div>
      )}

      {variant === 'bars' && (
        <div className="flex items-end gap-1">
          <div
            className={`
              ${size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-2 h-8' : size === 'lg' ? 'w-3 h-12' : 'w-4 h-16'}
              bg-blue-600
              rounded-sm
              animate-pulse
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={`
              ${size === 'sm' ? 'w-1 h-6' : size === 'md' ? 'w-2 h-10' : size === 'lg' ? 'w-3 h-14' : 'w-4 h-20'}
              bg-blue-600
              rounded-sm
              animate-pulse
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={`
              ${size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-2 h-8' : size === 'lg' ? 'w-3 h-12' : 'w-4 h-16'}
              bg-blue-600
              rounded-sm
              animate-pulse
            `.trim().replace(/\s+/g, ' ')}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      )}

      {text && (
        <p className={`text-sm font-medium ${textColors[color]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// ===== LOADING OVERLAY =====

export interface LoadingOverlayProps extends LoadingProps {
  visible: boolean;
}

export function LoadingOverlay({
  visible,
  ...props
}: LoadingOverlayProps) {
  if (!visible) return null;

  return <Loading {...props} fullScreen />;
}

// ===== SKELETON LOADER =====

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const baseStyles = 'animate-shimmer bg-gray-200 rounded';

  const variants = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}

// ===== SKELETON GROUP (para múltiples líneas) =====

export interface SkeletonGroupProps {
  lines?: number;
  gap?: string;
  lastLineWidth?: string;
}

export function SkeletonGroup({
  lines = 3,
  gap = 'gap-2',
  lastLineWidth = '60%',
}: SkeletonGroupProps) {
  return (
    <div className={`flex flex-col ${gap}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

// ===== SKELETON CARD =====

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <SkeletonGroup lines={2} />
        </div>
      </div>
    </div>
  );
}

// ===== LOADING PARA IMAGEN =====

export function ImageLoading() {
  return (
    <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
      <Loading size="lg" variant="pulse" text="Cargando imagen..." />
    </div>
  );
}

// ===== PROGRESS BAR =====

export interface ProgressProps {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Progress({
  value,
  variant = 'default',
  showPercentage = false,
  size = 'md',
  animated = true,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variants = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`
            ${variants[variant]}
            ${sizes[size]}
            rounded-full
            transition-all
            duration-300
            ${animated ? 'animate-pulse' : ''}
          `.trim().replace(/\s+/g, ' ')}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(clampedValue)}%
        </p>
      )}
    </div>
  );
}