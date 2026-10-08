import { useRouter } from '@/lib/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import PricingPage from '@/pages/PricingPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import TrackPage from '@/pages/TrackPage';
import ContactPage from '@/pages/ContactPage';
import ApplyPage from '@/pages/ApplyPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import CustomerLoginPage from '@/pages/CustomerLoginPage';
import CustomerDashboardPage from '@/pages/CustomerDashboardPage';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function App() {
  const { route, navigate } = useRouter();
  const [sessionReady, setSessionReady] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsCustomerLoggedIn(Boolean(data.session));
      setSessionReady(true);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsCustomerLoggedIn(Boolean(session));
      setSessionReady(true);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

const guardedNavigate = useCallback((to: Route) => {
  if (to === 'apply') {
    if (!sessionReady) return;

    if (!isCustomerLoggedIn) {
      sessionStorage.setItem('hds_after_login', 'apply');
      navigate('customer-login');
      return;
    }
  }

  navigate(to);
}, [isCustomerLoggedIn, navigate, sessionReady]);

  useEffect(() => {
    if (route === 'apply' && sessionReady && !isCustomerLoggedIn) {
      sessionStorage.setItem('hds_after_login', 'apply');
      navigate('customer-login');
    }
  }, [route, sessionReady, isCustomerLoggedIn, navigate]);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', true).maybeSingle().then(({ data }) => {
      if (!data) return;
      document.title = data.seo_title || data.site_title || 'Hakimi Digital Services';
      const setMeta = (name: string, content: string, property = false) => {
        if (!content) return;
        const attr = property ? 'property' : 'name';
        let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
        el.content = content;
      };
      setMeta('description', data.seo_description || '');
      setMeta('keywords', data.seo_keywords || '');
      setMeta('og:title', data.seo_title || data.site_title || '', true);
      setMeta('og:description', data.seo_description || '', true);
      if (data.og_image_url) setMeta('og:image', data.og_image_url, true);
      if (data.google_site_verification) setMeta('google-site-verification', data.google_site_verification);
      if (data.google_analytics_id && !document.getElementById('hds-ga')) { const ga = document.createElement('script'); ga.id='hds-ga'; ga.async=true; ga.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(data.google_analytics_id)}`; document.head.appendChild(ga); const inline=document.createElement('script'); inline.id='hds-ga-inline'; inline.textContent=`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${String(data.google_analytics_id).replace(/'/g,'')}');`; document.head.appendChild(inline); }
      const id = 'hds-structured-data';
      document.getElementById(id)?.remove();
      const script = document.createElement('script'); script.id = id; script.type = 'application/ld+json';
      script.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'ProfessionalService', name:'Hakimi Digital Services', url:'https://hakimidigitalservices.com', telephone:'+91 77208 49522', address:{ '@type':'PostalAddress', streetAddress:'32 Gala Market, Opp PWD Office, Dondaicha Road', addressLocality:'Shahada', addressCountry:'IN' }, sameAs:data.instagram_profile_url?[data.instagram_profile_url]:[] });
      document.head.appendChild(script);
    });
  }, []);

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage navigate={guardedNavigate} />;
      case 'about':
        return <AboutPage navigate={guardedNavigate} />;
      case 'services':
        return <ServicesPage navigate={guardedNavigate} />;
      case 'pricing':
        return <PricingPage navigate={guardedNavigate} />;
      case 'how-it-works':
        return <HowItWorksPage navigate={guardedNavigate} />;
      case 'track':
        return <TrackPage navigate={guardedNavigate} />;
      case 'contact':
        return <ContactPage navigate={guardedNavigate} />;
      case 'apply':
        return <ApplyPage navigate={guardedNavigate} />;
      case 'privacy':
        return <PrivacyPage navigate={guardedNavigate} />;
      case 'terms':
        return <TermsPage navigate={guardedNavigate} />;
      case 'customer-login':
        return <CustomerLoginPage navigate={guardedNavigate} />;
      case 'dashboard':
        return <CustomerDashboardPage navigate={guardedNavigate} />;
      default:
        return <HomePage navigate={guardedNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header route={route} navigate={guardedNavigate} />
      <main className="flex-1 pb-16 lg:pb-0">{renderPage()}</main>
      <Footer navigate={guardedNavigate} />
      <MobileBottomNav navigate={guardedNavigate} />
    </div>
  );
}

export default App;
