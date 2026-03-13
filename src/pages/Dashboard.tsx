import { useNavigate } from "react-router-dom";
import { supabase } from "@/Modules/auth/supabase-bridge";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white font-sans">
      <div className="max-w-xl border border-gray-800 p-10 rounded-3xl bg-neutral-900">
        <h1 className="text-3xl font-bold mb-4">Vault Access: Granted</h1>
        <p className="text-gray-400 mb-8">Modular ProtectedRoute is active and verifying.</p>
        <button onClick={handleSignOut} className="text-red-500 hover:text-red-400 underline font-bold">
          TERMINATE SESSION
        </button>
      </div>
    </div>
  );
}