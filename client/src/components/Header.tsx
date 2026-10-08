import { useState, useEffect } from 'react';
import {
  Phone,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  UserRound,
  LogOut,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'About Us', route: 'about' },
  { label: 'Services', route: 'services' },
  { label: 'Pricing', route: 'pricing' },
  { label: 'How It Works', route: 'how-it-works' },
  { label: 'Track Application', route: 'track' },
  { label: 'Contact Us', route: 'contact' },
];

export default function Header({
  route,
  navigate,
}: {
  route: Route;
  navigate: (r: Route) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  /* -----------------------------------------
     Scroll effect
  ----------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* -----------------------------------------
     Close mobile menu when route changes
  ----------------------------------------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [route]);

  /* -----------------------------------------
     Load customer session
  ----------------------------------------- */
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      const user = data.session?.user;

      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Customer';

        setUserName(name);
        setLoggedIn(true);
      } else {
        setUserName(null);
        setLoggedIn(false);
      }
    };

    loadUser();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Customer';

        setUserName(name);
        setLoggedIn(true);
      } else {
        setUserName(null);
        setLoggedIn(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  /* -----------------------------------------
     Normal navigation
  ----------------------------------------- */
  const handleNav = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  /* -----------------------------------------
     Reviews navigation
     - If already on Home → smooth scroll
     - If on another page → Home first, then scroll
  ----------------------------------------- */
  const handleReviews = () => {
    setMobileOpen(false);

    const scrollToReviews = () => {
      const reviewsSection = document.getElementById('reviews');

      if (reviewsSection) {
        reviewsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    if (route === 'home') {
      scrollToReviews();
      return;
    }

    navigate('home');

    setTimeout(() => {
      scrollToReviews();
    }, 400);
  };

  /* -----------------------------------------
     Customer button
  ----------------------------------------- */
  const handleCustomerClick = () => {
    if (loggedIn) {
      handleNav('dashboard');
    } else {
      handleNav('customer-login');
    }
  };

  /* -----------------------------------------
     Logout
  ----------------------------------------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUserName(null);
    setLoggedIn(false);

    handleNav('home');
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-md shadow-navy-900/5 backdrop-blur-md'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-x">
        <div className="flex h-16 items-center justify-between lg:h-20">

          {/* =========================================
              LOGO
          ========================================= */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 lg:h-12 lg:w-12">
              <ShieldCheck
                className="h-5 w-5 text-gold-500 lg:h-6 lg:w-6"
                strokeWidth={2.5}
              />
            </div>

            <div className="text-left leading-none">
              <div className="font-display text-base font-extrabold tracking-tight text-navy-900 lg:text-lg">
                HAKIMI
              </div>

              <div className="text-[10px] font-semibold tracking-[0.15em] text-gold-600 lg:text-xs">
                DIGITAL SERVICES
              </div>
            </div>
          </button>

          {/* =========================================
              DESKTOP NAVIGATION
          ========================================= */}
          <nav className="hidden items-center gap-5 lg:flex">

            {NAV_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`nav-link ${
                  route === item.route ? 'active' : ''
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Reviews */}
            <button
              onClick={handleReviews}
              className="nav-link ml-2"
            >
              Reviews
            </button>

          </nav>

          {/* =========================================
              DESKTOP CTA AREA
          ========================================= */}
          <div className="hidden items-center gap-4 lg:flex">

            {/* Customer Login / Customer Name */}
            <button
              onClick={handleCustomerClick}
              className="ml-4 flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 hover:text-gold-600"
            >
              <UserRound className="h-4 w-4" />

              {loggedIn ? (
                <span className="max-w-[130px] truncate">
                  {userName}
                </span>
              ) : (
                'Customer Login'
              )}
            </button>

            {/* Call */}
            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 hover:text-gold-600"
            >
              <Phone className="h-4 w-4" />
              Call {BUSINESS.phone}
            </a>

            {/* Apply Now */}
            <button
              onClick={() => handleNav('apply')}
              className="ml-1 flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          {/* =========================================
              MOBILE MENU BUTTON
          ========================================= */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-800 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

        </div>
      </div>

      {/* =========================================
          MOBILE MENU
      ========================================= */}
      {mobileOpen && (
        <div className="border-t border-navy-100 bg-white shadow-lg lg:hidden">

          <nav className="container-x flex flex-col py-4">

            {/* Main Navigation */}
            {NAV_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  route === item.route
                    ? 'bg-navy-50 text-navy-900'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                {item.label}

                <ArrowRight className="h-4 w-4 opacity-40" />
              </button>
            ))}

            {/* =====================================
                MOBILE REVIEWS
            ===================================== */}
            <button
              onClick={handleReviews}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              <span>Reviews</span>

              <ArrowRight className="h-4 w-4 opacity-40" />
            </button>

            {/* =====================================
                MOBILE CTA AREA
            ===================================== */}
            <div className="mt-3 flex flex-col gap-2 px-4">

              {/* Customer */}
              <button
                onClick={handleCustomerClick}
                className="flex items-center justify-center gap-2 rounded-lg border border-navy-200 px-4 py-3 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 hover:text-gold-600"
              >
                <UserRound className="h-4 w-4" />

                {loggedIn ? userName : 'Customer Login'}
              </button>

              {/* Logout */}
              {loggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}

              {/* Call */}
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-navy-200 px-4 py-3 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 hover:text-gold-600"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </a>

              {/* Apply Now */}
              <button
                onClick={() => handleNav('apply')}
                className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-900 transition-all hover:bg-gold-400"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>
          </nav>
        </div>
      )}
    </header>
  );
}