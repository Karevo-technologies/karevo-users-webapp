import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import logo from "../../assets/logo.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      await register(formData.email, formData.password, formData.name);
      navigate("/login");
    } catch (err) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (() => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  })();

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-rose-500";
    if (passwordStrength < 3) return "bg-amber-500";
    return "bg-emerald-500";
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
              className="w-[100rem] h-[10rem] object-contain" 
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Good to have you here 
          </h1>
          <p className="text-xl font-medium text-slate-500 dark:text-slate-400 mt-2.5">
            Create your account
          </p>
        </div>

        {/* Structural Form Layer */}
        <Card className="p-8 bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 backdrop-blur-md rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Context Error Notice */}
            {errors.submit && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{errors.submit}</p>
              </div>
            )}

            {/* Name Input Framework */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 pl-1">{errors.name}</p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 pl-1">{errors.email}</p>
              )}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 pl-1">{errors.password}</p>
              )}

              {/* Advanced Analytics Strength Engine */}
              {formData.password && (
                <div className="space-y-2 mt-2.5 px-1 animate-in fade-in duration-200">
                  <div className="flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength
                            ? getPasswordStrengthColor()
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-500">
                    {passwordStrength < 2 && "Security Level: Weak"}
                    {passwordStrength === 2 && "Security Level: Fair"}
                    {passwordStrength === 3 && "Security Level: Good"}
                    {passwordStrength === 4 && "Security Level: Ideal"}
                  </p>
                </div>
              )}
            </div>

            {/* Validation Match Input Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-11 pr-4 py-6 text-sm bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 pl-1">{errors.confirmPassword}</p>
              )}
              {formData.password && formData.confirmPassword === formData.password && (
                <div className="flex items-center gap-1.5 pl-1 mt-1.5 animate-in fade-in duration-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Credential mapping aligns</p>
                </div>
              )}
            </div>

            {/* Terms Consensus Box */}
            <label className="flex items-start gap-3 cursor-pointer pt-1 group select-none">
              <input 
                type="checkbox" 
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-600/20 accent-indigo-600" 
                required 
              />
              <span className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                I have read and agreed to the{" "}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Executive Action Trigger */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 mt-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Creating workspace..." : "Create Account"}
            </Button>

            {/* Navigational Anchor */}
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;