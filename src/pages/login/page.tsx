import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import logo from "../../assets/logo.png";

const organisationBenefits = [
  "Verify organisation access in seconds",
  "Keep permissions protected and private",
  "Maintain a secure access trail",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() && !password) {
      setError("Enter your organisation email address and password.");
      return;
    }

    if (!email.trim()) {
      setError("Enter your organisation email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid organisation email address.");
      return;
    }

    if (!password) {
      setError("Enter your password to sign in.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/org/dashboard");
    } catch {
      setError(
        "We couldn’t sign you in with those organisation credentials. Check your email and password and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-slate-900 antialiased">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      
        {/* left section where the welcome is */}
        <aside className="relative hidden overflow-hidden bg-[#00594f] px-10 py-12 text-white lg:flex lg:flex-col xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-white/20" />
            {/* for the abstract circle at the bottob left conrn */}
          <div className="relative flex items-center">
            <img
              src={logo}
              alt="K-ID"
              className="h-50 w-auto max-w-[150px] object-contain brightness-0 invert"
            />
            {/* the invert might not be needed incase of white image provided */}
          </div>

          <div className="relative max-w-xl">
            <h1 className="kv-display max-w-md text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
              Secure organisation access, made simple.
            </h1>

            <ul className="mt-10 space-y-5" aria-label="K-ID organisation benefits">
              {organisationBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-base font-medium text-white/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          {/* the above has same code but different paprent style for padding nad margining, comment pout for reuse if needed later */}
          {/* <div className="relative my-auto max-w-xl pt-20">
            <h1 className="kv-display max-w-md text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
              Secure organisation access, made simple.
            </h1>

            <ul className="mt-10 space-y-5" aria-label="K-ID organisation benefits">
              {organisationBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-base font-medium text-white/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div> */}

          <p className="relative flex items-center gap-2 text-sm text-white/75 pt-4">
            <ShieldCheck size={17} aria-hidden="true" />
            Organisation access is for verified entities only.
          </p>
        </aside>

        {/* Right section where the form is */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[385px]">
            <div className="mb-10 lg:hidden">
              <img src={logo} alt="K-ID" className="h-9 w-auto max-w-[132px] object-contain" />
            </div>

            <header className="mb-9">
              {/* <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#00594f]">
                K-ID Organisation Portal
              </p> */}
              <h1 className="kv-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your organisation account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use your verified organisation credentials to continue.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {error && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-5">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Organisation email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@organisation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={Boolean(error)}
                    className="h-[52px] rounded-2xl border-transparent bg-[#e5eeec] py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:border-[#00594f] focus-visible:bg-white focus-visible:ring-[#00594f]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                    Password
                  </label>
                  <a href="#" className="text-sm font-semibold text-[#00594f] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={Boolean(error)}
                    className="h-[52px] rounded-2xl border-transparent bg-[#e5eeec] py-3 pl-12 pr-12 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:border-[#00594f] focus-visible:bg-white focus-visible:ring-[#00594f]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((visible) => !visible)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[##00594f] hover:text-[#00594f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00594f]/30"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-[52px] w-full rounded-2xl bg-[#00594f] text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#004941] focus-visible:ring-[#00594f]/30"
              >
                {isLoading ? "Signing in…" : "Sign in"}
                {!isLoading && <ArrowRight size={18} aria-hidden="true" />}
              </Button>
            </form>

            <p className="mt-9 text-center text-sm text-slate-600">
              New to K-ID?{" "}
              <Link to="/register" className="font-semibold text-[#00594f] hover:underline">
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-slate-500 lg:hidden">
              Organisation access is for verified entities only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
