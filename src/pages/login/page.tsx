import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Mail, Lock, AlertCircle } from "lucide-react";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email");
        return;
      }

      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-[440px]">
        
        {/* Header Segment */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-5 overflow-hidden transition-transform duration-300 hover:scale-105">
            <img 
              src={logo} 
              alt="Karevo" 
              className="w-full h-full object-contain filter drop-shadow-sm" 
            />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome Back
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2.5">
            Log In to your account
          </p>
        </div>

        {/* Structural Form Layer */}
        <Card className="p-8 bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 backdrop-blur-md rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Context Error Notice */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
              </div>
            )}

            {/* Email Input Framework */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input Framework */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Remember me & Password Utility Anchors */}
            <div className="flex items-center justify-between pt-1 select-none">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-600/20 accent-indigo-600" 
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Executive Action Trigger */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 mt-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Verifying..." : "Sign In to Account"}
            </Button>

            {/* Decorative Grid Separator */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">or</span>
              </div>
            </div>

            {/* Navigational Anchor */}
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </Card>

        {/* Global Bottom Policy Disclaimers */}
        <p className="text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500 mt-8 px-4">
          By signing in, you agree to our{" "}
          <a href="#" className="hover:underline font-medium text-slate-500 dark:text-slate-400">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="hover:underline font-medium text-slate-500 dark:text-slate-400">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;