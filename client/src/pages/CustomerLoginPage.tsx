import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { type Route } from '@/lib/router';

type PageMode = 'login' | 'signup' | 'forgot' | 'reset';

export default function CustomerLoginPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const [mode, setMode] = useState<PageMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /*
   * Supabase password recovery detection.
   * When the user clicks the reset email link, Supabase creates
   * a recovery session and fires PASSWORD_RECOVERY.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        setError(null);
        setMessage(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearMessages = () => {
    setError(null);
    setMessage(null);
  };

  const goToLogin = () => {
    setMode('login');
    clearMessages();
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const submitLogin = async () => {
    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) throw loginError;

    const afterLogin = sessionStorage.getItem('hds_after_login');
    sessionStorage.removeItem('hds_after_login');

    navigate(afterLogin === 'apply' ? 'apply' : 'dashboard');
  };

  const submitSignup = async () => {
    if (!name.trim()) {
      throw new Error('Please enter your full name.');
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      throw new Error('Mobile number must be 10 digits.');
    }

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            mobile_number: mobile.trim(),
          },
        },
      });

    if (signUpError) throw signUpError;

    if (data.session) {
      const afterLogin = sessionStorage.getItem('hds_after_login');
      sessionStorage.removeItem('hds_after_login');

      navigate(afterLogin === 'apply' ? 'apply' : 'dashboard');
    } else {
      setMessage(
        'Account created successfully. Please check your email if verification is required, then login.'
      );
    }
  };

  const submitForgotPassword = async () => {
    if (!email.trim()) {
      throw new Error('Please enter your registered email address.');
    }

    const redirectTo = `${window.location.origin}/#/customer-login`;

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        }
      );

    if (resetError) throw resetError;

    setMessage(
      'Password reset link has been sent to your email. Please check your inbox and spam folder.'
    );
  };

  const submitResetPassword = async () => {
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) throw updateError;

    setMessage(
      'Password updated successfully. You can now login with your new password.'
    );

    setNewPassword('');
    setConfirmPassword('');
    setMode('login');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    setBusy(true);
    clearMessages();

    try {
      if (mode === 'login') {
        await submitLogin();
      } else if (mode === 'signup') {
        await submitSignup();
      } else if (mode === 'forgot') {
        await submitForgotPassword();
      } else if (mode === 'reset') {
        await submitResetPassword();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-10 lg:py-16">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-xl lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="bg-navy-900 p-8 text-white lg:p-12">
            <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-3">
              <LockKeyhole className="h-7 w-7 text-gold-400" />
            </div>

            <h1 className="font-display text-3xl font-extrabold lg:text-4xl">
              Your HDS Customer Portal
            </h1>

            <p className="mt-4 leading-7 text-navy-100">
              Track applications, upload documents, download certificates
              and contact our team from one secure dashboard.
            </p>

            <div className="mt-8 space-y-3 text-sm text-navy-100">
              <div>✓ Application status in one place</div>
              <div>✓ Document & certificate access</div>
              <div>✓ Direct WhatsApp support</div>
              <div>✓ Support requests without calling</div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-7 lg:p-10">

            {/* LOGIN / SIGNUP / FORGOT */}
            {mode !== 'reset' && (
              <>
                <div className="mb-4 rounded-2xl border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <b className="text-navy-900">
                        Login required before applying
                      </b>

                      <div className="text-xs text-navy-500">
                        Your name, mobile and email can be pre-filled
                        automatically on the application form.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* LOGIN / SIGNUP TABS */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="mb-7 flex rounded-xl bg-navy-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearMessages();
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    mode === 'login'
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-navy-500'
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    clearMessages();
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    mode === 'signup'
                      ? 'bg-white text-navy-900 shadow-sm'
                      : 'text-navy-500'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* FORGOT PASSWORD HEADER */}
            {mode === 'forgot' && (
              <div className="mb-7">
                <button
                  type="button"
                  onClick={goToLogin}
                  className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                  <KeyRound className="h-7 w-7" />
                </div>

                <h2 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
                  Forgot Password?
                </h2>

                <p className="mt-2 text-sm leading-6 text-navy-500">
                  Enter your registered email address and we will send you
                  a password reset link.
                </p>
              </div>
            )}

            {/* RESET PASSWORD HEADER */}
            {mode === 'reset' && (
              <div className="mb-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                  <KeyRound className="h-7 w-7" />
                </div>

                <h2 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
                  Set New Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-navy-500">
                  Create a new password for your Hakimi Digital Services
                  customer account.
                </p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">

              {/* SIGNUP FIELDS */}
              {mode === 'signup' && (
                <>
                  <label className="block text-sm font-semibold text-navy-800">
                    Full Name

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field mt-1.5"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-navy-800">
                    Mobile Number

                    <input
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 10)
                        )
                      }
                      className="input-field mt-1.5"
                      placeholder="10-digit mobile"
                    />
                  </label>
                </>
              )}

              {/* EMAIL */}
              {mode !== 'reset' && (
                <label className="block text-sm font-semibold text-navy-800">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field mt-1.5"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              )}

              {/* LOGIN / SIGNUP PASSWORD */}
              {(mode === 'login' || mode === 'signup') && (
                <label className="block text-sm font-semibold text-navy-800">
                  <span className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4" />
                    Password
                  </span>

                  <span className="relative block">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="input-field mt-1.5 pr-11"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-3.5 text-navy-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </span>
                </label>
              )}

              {/* FORGOT PASSWORD LINK */}
              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      clearMessages();
                    }}
                    className="text-sm font-semibold text-navy-700 hover:text-gold-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* NEW PASSWORD */}
              {mode === 'reset' && (
                <>
                  <label className="block text-sm font-semibold text-navy-800">
                    New Password

                    <span className="relative block">
                      <input
                        type={
                          showNewPassword ? 'text' : 'password'
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        className="input-field mt-1.5 pr-11"
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        className="absolute right-3 top-3.5 text-navy-400"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>

                  <label className="block text-sm font-semibold text-navy-800">
                    Confirm New Password

                    <span className="relative block">
                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        className="input-field mt-1.5 pr-11"
                        placeholder="Confirm new password"
                        minLength={6}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-3.5 text-navy-400"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>
                </>
              )}

              {/* ERROR */}
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              {/* MAIN BUTTON */}
              <button
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3.5 font-bold text-navy-900 transition hover:bg-gold-400 disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Login to Dashboard'
                    : mode === 'signup'
                      ? 'Create Customer Account'
                      : mode === 'forgot'
                        ? 'Send Reset Link'
                        : 'Update Password'}

                {mode === 'login' && (
                  <ArrowRight className="h-4 w-4" />
                )}

                {mode === 'signup' && (
                  <UserPlus className="h-4 w-4" />
                )}

                {mode === 'forgot' && (
                  <Mail className="h-4 w-4" />
                )}

                {mode === 'reset' && (
                  <KeyRound className="h-4 w-4" />
                )}
              </button>
            </form>

            {/* BACK TO LOGIN */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={goToLogin}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            )}

            <p className="mt-5 text-center text-xs text-navy-400">
              By continuing, you agree to our website terms and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}