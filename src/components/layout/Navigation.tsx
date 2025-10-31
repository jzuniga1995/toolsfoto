'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  showIcons?: boolean;
}

export default function Navigation({
  items,
  orientation = 'horizontal',
  showIcons = false,
}: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (orientation === 'vertical') {
    return (
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            {showIcons && item.icon && (
              <span className="flex-shrink-0">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center gap-2 text-sm font-medium transition-colors
            ${
              isActive(item.href)
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }
          `.trim().replace(/\s+/g, ' ')}
        >
          {showIcons && item.icon && (
            <span className="flex-shrink-0">{item.icon}</span>
          )}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// ===== NAVIGATION CON TABS =====

export interface TabNavigationProps {
  items: NavItem[];
  activeTab: string;
  onChange: (href: string) => void;
}

export function TabNavigation({ items, activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-8">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => onChange(item.href)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === item.href
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ===== NAVIGATION CON PILLS =====

export interface PillNavigationProps {
  items: NavItem[];
  activeItem: string;
  onChange: (href: string) => void;
}

export function PillNavigation({ items, activeItem, onChange }: PillNavigationProps) {
  return (
    <nav className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => onChange(item.href)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              activeItem === item.href
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }
          `.trim().replace(/\s+/g, ' ')}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// ===== SIDEBAR NAVIGATION =====

export interface SidebarNavigationProps {
  title?: string;
  items: NavItem[];
}

export function SidebarNavigation({ title, items }: SidebarNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {title}
        </h2>
      )}
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
              ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            {item.icon && (
              <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// ===== MOBILE NAVIGATION DRAWER =====

export interface MobileNavigationProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ items, isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl animate-slide-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Menú
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                  ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `.trim().replace(/\s+/g, ' ')}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}