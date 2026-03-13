import { useState, useEffect } from 'react';
import { handleSignUp, handleSignIn } from './auth-actions';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Security: Password must be 8+ characters."),
});

export const AuthModule = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer((prev) => prev - 1), 1000);
    } else if (lockoutTimer === 0 && attempts >= 5) {
      setAttempts(0);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer, attempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setError(null);

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await handleSignIn(email, password);
        toast.success("Identity Verified.");
        navigate('/dashboard'); 
      } else {
        await handleSignUp(email, password);
        toast.success("Security: Verification email sent.");
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTimer(30);
        setError("Security Alert: System Locked for 30s.");
      } else {
        setError(err.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {lockoutTimer > 0 && <p className="text-red-500 text-xs mt-2">Locked: {lockoutTimer}s</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-xs bg-red-50 text-red-500 rounded border border-red-100">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || lockoutTimer > 0}
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || lockoutTimer > 0}
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || lockoutTimer > 0}
          className="w-full py-2 bg-black text-white rounded font-bold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Authenticating..." : isLogin ? "Access System" : "Register"}
        </button>
      </form>
      
      <div className="text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-gray-500 hover:underline"
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};