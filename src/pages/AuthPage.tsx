import { AuthModule } from "@/Modules/auth";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <AuthModule />
      </div>
    </div>
  );
}