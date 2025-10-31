import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  // Estilos base
  const baseStyles = 'px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  // Estados
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';

  // Con iconos
  const withLeftIcon = leftIcon ? 'pl-11' : '';
  const withRightIcon = rightIcon ? 'pr-11' : '';

  const inputClasses = `
    ${baseStyles}
    ${error ? errorStyles : normalStyles}
    ${withLeftIcon}
    ${withRightIcon}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// ===== INPUT DE NÚMERO CON CONTROLES =====

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function NumberInput({
  min,
  max,
  step = 1,
  value,
  onChange,
  onIncrement,
  onDecrement,
  ...props
}: NumberInputProps) {
  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement();
    } else if (onChange && value !== undefined) {
      const newValue = Number(value) + step;
      if (max === undefined || newValue <= max) {
        onChange({
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDecrement = () => {
    if (onDecrement) {
      onDecrement();
    } else if (onChange && value !== undefined) {
      const newValue = Number(value) - step;
      if (min === undefined || newValue >= min) {
        onChange({
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      rightIcon={
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleIncrement}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Incrementar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Decrementar"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      }
      {...props}
    />
  );
}

// ===== TEXTAREA =====

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const baseStyles = 'px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]';
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';

  const textareaClasses = `
    ${baseStyles}
    ${error ? errorStyles : normalStyles}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={textareaClasses}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// ===== INPUT DE ARCHIVO =====

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  buttonText?: string;
}

export function FileInput({
  label,
  error,
  helperText,
  fullWidth = false,
  buttonText = 'Seleccionar archivo',
  className = '',
  id,
  onChange,
  ...props
}: FileInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [fileName, setFileName] = React.useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
    onChange?.(e);
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type="file"
          className="sr-only"
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            ${error ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600">
            {fileName || buttonText}
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}