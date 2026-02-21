// src/app/admin/login/page.tsx
import LoginForm from "@/app/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}