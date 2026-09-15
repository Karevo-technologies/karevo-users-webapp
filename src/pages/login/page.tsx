import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  IdentityCardIcon,
  LockIcon,
  Mail01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";
import { NIN_LENGTH, isValidNin } from "../../lib/nin";

const KAREVO_BRAND = "#3B00C5";

const patientBenefits = [
  "Access your health records anytime",
  "Share consent with trusted providers",
  "Keep your data private and protected",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nin, setNin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() && !password && !nin.trim()) {
      setError("Enter your email address, password, and NIN.");
      return;
    }

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!nin.trim()) {
      setError("Enter your National Identification Number (NIN).");
      return;
    }

    if (!isValidNin(nin)) {
      setError(`Enter a valid ${NIN_LENGTH}-digit NIN.`);
      return;
    }

    if (!password) {
      setError("Enter your password to sign in.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, nin);
      navigate("/dashboard");
    } catch {
      setError(
        "We couldn’t sign you in with those credentials. Check your email and password and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-slate-900 antialiased">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

        {/* left section where the welcome is */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[color:var(--kv-brand)] to-[#6425E8] px-10 py-12 text-white lg:flex lg:flex-col xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-white/20" />
          <div className="relative flex items-center">
            <img
              src={logo}
              alt="Karevo"
              className="h-50 w-auto max-w-[150px] object-contain brightness-0 invert"
            />
          </div>

          <div className="relative max-w-xl">
            <h1 className="kv-display max-w-md text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">
              Your health, securely in your hands.
            </h1>

            <ul className="mt-10 space-y-5" aria-label="Karevo patient benefits">
              {patientBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-base font-medium text-white/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <HugeiconsIcon icon={CheckIcon} size={15} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative flex items-center gap-2 text-sm text-white/75 pt-4">
            <HugeiconsIcon icon={SecurityCheckIcon} size={17} aria-hidden="true" />
            Your health information is encrypted and private.
          </p>
        </aside>

        {/* Right section where the form is */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[385px]">
            <div className="mb-2 lg:hidden">
              <img src={logo} alt="Karevo" className="h-20 w-auto max-w-[132px] object-contain" />
            </div>

            <header className="mb-9">
              <h1 className="kv-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your Karevo account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use your account credentials to continue.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {error && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800"
                  role="alert"
                >
                  <HugeiconsIcon icon={AlertCircleIcon} size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-5">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Email address
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={Boolean(error)}
                    className="h-[52px] rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[color:var(--kv-brand)] focus-visible:ring-[color:var(--kv-brand)]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nin" className="text-sm font-semibold text-slate-800">
                  National Identification Number (NIN)
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={IdentityCardIcon}
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="nin"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={NIN_LENGTH}
                    placeholder="12345678901"
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
                    disabled={isLoading}
                    aria-invalid={Boolean(error)}
                    className="h-[52px] rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[color:var(--kv-brand)] focus-visible:ring-[color:var(--kv-brand)]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                    Password
                  </label>
                  <a href="#" className="text-sm font-semibold text-[color:var(--kv-brand)] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockIcon}
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                    className="h-[52px] rounded-full border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-[color:var(--kv-brand)] focus-visible:ring-[color:var(--kv-brand)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((visible) => !visible)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[color:var(--kv-brand)]/10 hover:text-[color:var(--kv-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kv-brand)]/30"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? (
                      <HugeiconsIcon icon={EyeOffIcon} size={19} />
                    ) : (
                      <HugeiconsIcon icon={EyeIcon} size={19} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: KAREVO_BRAND }}
                className="h-[52px] w-full rounded-2xl text-sm font-semibold text-white shadow-none transition-colors hover:opacity-90 focus-visible:ring-[color:var(--kv-brand)]/30"
              >
                {isLoading ? "Signing in…" : "Sign in"}
                {!isLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />}
              </Button>
            </form>

            <p className="mt-9 text-center text-sm text-slate-600">
              New to Karevo?{" "}
              <Link to="/register" className="font-semibold text-[color:var(--kv-brand)] hover:underline">
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-slate-500 lg:hidden">
              Your health information is encrypted and private.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
