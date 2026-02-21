// src/components/admin/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
    >
      Cerrar Sesión
    </button>
  );
}