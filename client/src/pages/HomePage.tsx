import { useState, useEffect } from 'react';
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  MonitorSmartphone,
  Headphones,
  Eye,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  FileCheck2,
  Sparkles,
  FileText,
  Search,
  Upload,
  Cog,
  Award,
  Phone,
  MapPin,
  Star,
  ExternalLink,
  Tag,
  Clock,
} from 'lucide-react';

import { BUSINESS, SERVICES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { type Route } from '@/lib/router';
import ServiceIcon from '@/components/ServiceIcon';
import Reveal from '@/components/Reveal';

const TRUST_BADGES = [
  { icon: Lock, label: 'Secure & Confidential' },
  { icon: Zap, label: 'Fast Processing' },
  { icon: MonitorSmartphone, label: 'Online Documentation' },
  { icon: Headphones, label: 'Expert Assistance' },
];

const WHY_CHOOSE_US = [
  {
    icon: ShieldCheck,
    title: 'Secure Documentation',
    description:
      'Your documents are handled with the utmost confidentiality and stored securely throughout the entire process.',
    accent: 'from-navy-900 to-navy-700',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description:
      'Track your application status in real-time. No hidden charges, no surprises — just clear, honest service.',
    accent: 'from-gold-600 to-gold-400',
  },
  {
    icon: Headphones,
    title: 'Expert Assistance',
    description:
      'Our experienced team guides you through every step, ensuring your application is complete and accurate.',
    accent: 'from-navy-800 to-navy-600',
  },
  {
    icon: MonitorSmartphone,
    title: 'Online Application',
    description:
      'Apply from anywhere in India. Submit documents online and get your certificates without visiting our office.',
    accent: 'from-gold-500 to-gold-300',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Choose Your Service',
    description:
      'Browse our services and select the one that matches your business needs.',
  },
  {
    step: '02',
    icon: Upload,
    title: 'Submit Documents',
    description:
      'Fill out the application form and upload your documents securely online.',
  },
  {
    step: '03',
    icon: Cog,
    title: 'We Process Your Application',
    description:
      'Our experts review and process your application with the relevant authorities.',
  },
  {
    step: '04',
    icon: Award,
    title: 'Receive Your Certificate',
    description:
      'Get your certificate or document delivered to you once processing is complete.',
  },
];

export default function HomePage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  /*
   * ============================================================
   * APPLY FLOW
   * ============================================================
   *
   * Logged out:
   * Apply Now → Customer Login → Login → Apply Page
   *
   * Logged in:
   * Apply Now → Direct Apply Page
   *
   * Service/Offer:
   * Apply Now → Customer Login/Login → Apply Page
   * with service already selected.
   */
  const handleApply = async (serviceName?: string) => {
    if (serviceName) {
      sessionStorage.setItem('hds_apply_service', serviceName);
    } else {
      sessionStorage.removeItem('hds_apply_service');
    }

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      sessionStorage.setItem('hds_after_login', 'apply');
      navigate('customer-login');
      return;
    }

    navigate('apply');
  };

  useEffect(() => {
    setMounted(true);

    let active = true;

    (async () => {
      const [serviceRes, offerRes, reviewRes] = await Promise.all([
        supabase
          .from('service_catalog')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),

        supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
          .limit(6),

        supabase
          .from('customer_reviews')
          .select('*')
          .eq('is_active', true)
          
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (!active) return;

      if (!serviceRes.error) {
        setLiveServices(serviceRes.data || []);
      }

      if (!offerRes.error) {
        setOffers(offerRes.data || []);
      }

      if (!reviewRes.error) {
        setReviews(reviewRes.data || []);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* ========================================================
          INSTAGRAM PROFILE
      ======================================================== */}
      <section className="border-b border-navy-100 bg-white">
        <div className="container-x py-4">
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/hakimidigitalservices/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-gold-500 hover:text-navy-950"
            >
              Follow @hakimidigitalservices on Instagram
              <ArrowUpRight className="h-4 w-4 text-gold-400" />
            </a>
          </div>
        </div>
      </section>
      {/* ========================================================
          HERO
      ======================================================== */}
      <section className="relative overflow-hidden bg-navy-900 pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-900" />

        <div className="absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-[100px]" />

        <div className="absolute -left-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-gold-500/5 blur-[80px]" />

        <div className="container-x relative">
          <div className="grid items-center gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
            {/* Left: copy */}
            <div
              className={`lg:col-span-7 ${
                mounted ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-gold-400" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
                </span>

                <span className="text-xs font-semibold tracking-wide text-gold-300">
                  One Platform for All Your Business Documentation
                </span>
              </div>

              <h1 className="mt-7 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                BUSINESS DOCUMENTATION
                <br />
                <span className="text-gradient-gold">
                  & DIGITAL SERVICES
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-200 sm:text-lg">
                From business registration and government licenses to
                compliance and digital services, we make the process simple,
                secure and hassle-free.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleApply()}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/40 active:scale-[0.97]"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 active:scale-[0.97]"
                >
                  <MessageCircle className="h-4 w-4 transition-colors group-hover:text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TRUST_BADGES.map((badge, idx) => (
                  <div
                    key={badge.label}
                    className={`group flex flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/[0.06] ${
                      mounted ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: `${0.3 + idx * 0.08}s`,
                    }}
                  >
                    <badge.icon className="h-5 w-5 text-gold-400 transition-transform duration-300 group-hover:scale-110" />

                    <span className="text-[11px] font-medium leading-tight text-navy-200">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dashboard mockup */}
            <div
              className={`relative hidden lg:col-span-5 lg:block ${
                mounted ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.35s' }}
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-500/20 via-gold-500/5 to-transparent blur-3xl" />

                {/* Main card */}
                <div className="relative glass-card animate-float rounded-[1.5rem] p-7">
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 shadow-lg shadow-gold-500/20">
                        <ShieldCheck
                          className="h-5 w-5 text-navy-900"
                          strokeWidth={2.5}
                        />
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">
                          Application Tracker
                        </div>

                        <div className="text-xs text-navy-300">
                          Real-time status updates
                        </div>
                      </div>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                      Live
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="mt-7 space-y-5">
                    {[
                      {
                        label: 'Application Received',
                        done: true,
                        time: 'Day 1',
                      },
                      {
                        label: 'Documents Under Verification',
                        done: true,
                        time: 'Day 2',
                      },
                      {
                        label: 'Processing',
                        done: false,
                        active: true,
                        time: 'In progress',
                      },
                      {
                        label: 'Submitted',
                        done: false,
                        time: 'Pending',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                            item.done
                              ? 'bg-gold-500 text-navy-900 shadow-md shadow-gold-500/30'
                              : item.active
                                ? 'border-2 border-gold-500 bg-gold-500/20'
                                : 'border border-white/15 bg-white/5'
                          }`}
                        >
                          {item.done && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}

                          {item.active && (
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gold-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <span
                            className={`block text-sm ${
                              item.done
                                ? 'font-medium text-white'
                                : item.active
                                  ? 'font-semibold text-gold-300'
                                  : 'text-navy-400'
                            }`}
                          >
                            {item.label}
                          </span>

                          <span className="text-[11px] text-navy-400">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Application ID bar */}
                  <div className="mt-7 rounded-xl bg-navy-950/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-navy-300">
                        Application ID
                      </span>

                      <span className="font-mono text-sm font-semibold text-gold-400">
                        HDS-2026-001234
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating accent badge */}
                <div
                  className="absolute -right-4 -top-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-premium-lg animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <FileCheck2 className="h-4 w-4 text-green-600" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-navy-900">
                      Verified
                    </div>

                    <div className="text-[10px] text-navy-400">
                      Documents checked
                    </div>
                  </div>
                </div>

                {/* Floating accent badge bottom */}
                <div
                  className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-premium-lg animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
                    <Sparkles className="h-4 w-4 text-gold-600" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-navy-900">
                      10+ Services
                    </div>

                    <div className="text-[10px] text-navy-400">
                      All in one place
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg
            className="block w-full"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80L1440 80L1440 20Q720 80 0 20Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ========================================================
          LIVE OFFERS
      ======================================================== */}
      {offers.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-14 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

          <div className="container-x relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-gold-300">
                <Sparkles className="h-4 w-4" />
                Special Offers
              </span>

              <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Limited-Time Offers & Promotions
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-navy-200 sm:text-base">
                Save more on our most requested business services. Choose an
                offer and start your application in minutes.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer: any, idx: number) => (
                <Reveal key={offer.id} delay={idx * 70}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold-400/20 bg-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50">
                    <div className="flex items-center justify-between bg-gradient-to-r from-gold-500 to-gold-300 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-navy-950">
                      <span className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Special Deal
                      </span>

                      {offer.discount_text && (
                        <span>{offer.discount_text}</span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {offer.service_name && (
                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gold-700">
                          {offer.service_name}
                        </div>
                      )}

                      <h3 className="font-display text-xl font-extrabold text-navy-900">
                        {offer.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-6 text-navy-500">
                        {offer.description ||
                          'Professional assistance with a simple, secure online process.'}
                      </p>

                      {offer.price != null && (
                        <div className="mt-5 flex items-end gap-3">
                          <span className="text-3xl font-black text-navy-900">
                            ₹
                            {Number(offer.price).toLocaleString('en-IN')}
                          </span>

                          {offer.old_price != null && (
                            <span className="pb-1 text-sm font-semibold text-navy-400 line-through">
                              ₹
                              {Number(offer.old_price).toLocaleString(
                                'en-IN',
                              )}
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() =>
                          handleApply(offer.service_name || '')
                        }
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-gold-500 hover:text-navy-950"
                      >
                        Grab This Offer

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          POPULAR SERVICES
      ======================================================== */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Services</span>

            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-[2.75rem]">
              Popular Services
            </h2>

            <p className="mt-4 text-base leading-relaxed text-navy-500">
              Comprehensive business documentation and registration services,
              all in one place.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(liveServices.length ? liveServices : SERVICES)
              .filter((service: any) => {
                const promoted = offers.some(
                  (o: any) =>
                    o.is_active &&
                    ((o.service_id &&
                      o.service_id === service.id) ||
                      (o.service_name &&
                        String(o.service_name).toLowerCase() ===
                          String(service.name).toLowerCase())),
                );

                return !promoted;
              })
              .slice(0, 12)
              .map((service: any, idx: number) => (
                <Reveal
                  key={service.id || service.slug}
                  delay={idx * 60}
                >
                  <div className="card-premium group relative flex h-full flex-col overflow-hidden p-7">
                    {/* Hover gradient bar */}
                    <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-gold-300 transition-transform duration-500 group-hover:scale-x-100" />

                    <div className="flex items-start justify-between">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 transition-all duration-300 group-hover:bg-navy-900">
                        <ServiceIcon
                          name={service.icon || 'FileText'}
                          className="h-7 w-7 text-navy-700 transition-colors duration-300 group-hover:text-gold-400"
                        />
                      </div>

                      <span className="font-mono text-xs font-medium text-navy-300">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                      {service.name}
                    </h3>

                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-500">
                      {service.description}
                    </p>

                    {service.price != null && (
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-navy-900">
                          ₹{Number(service.price).toLocaleString('en-IN')}
                        </span>

                        {service.old_price != null && (
                          <span className="text-xs text-navy-400 line-through">
                            ₹
                            {Number(service.old_price).toLocaleString(
                              'en-IN',
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-navy-50 pt-4">
                      <button
                        onClick={() => handleApply(service.name)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700"
                      >
                        Apply Now

                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>

                      <ArrowUpRight className="h-4 w-4 text-navy-200 transition-all duration-300 group-hover:text-gold-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>

          <Reveal delay={100} className="mt-12 text-center">
            <button
              onClick={() => navigate('services')}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-8 py-4 text-sm font-semibold text-white shadow-premium transition-all duration-300 hover:bg-navy-800 hover:shadow-premium-lg active:scale-[0.97]"
            >
              View All Services

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          WHY CHOOSE US
      ======================================================== */}
      <section className="relative overflow-hidden bg-navy-50">
        <div className="absolute inset-0 bg-dots-light opacity-60" />

        <div className="container-x relative section-padding">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-premium text-xs font-semibold uppercase tracking-[0.12em] text-gold-700">
              Why Choose Us
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-[2.75rem]">
              Built for Trust and Transparency
            </h2>

            <p className="mt-4 text-base leading-relaxed text-navy-500">
              We focus on what matters most — security, transparency, and
              expert support for your documentation needs.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((feature, idx) => (
              <Reveal key={feature.title} delay={idx * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-navy-100 bg-white p-7 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg">
                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${feature.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                  />

                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon
                      className="h-7 w-7 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-navy-500">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS
      ======================================================== */}
      <section className="section-padding bg-white">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Simple Process</span>

            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-[2.75rem]">
              How It Works
            </h2>

            <p className="mt-4 text-base leading-relaxed text-navy-500">
              Get your documentation done in four simple steps — from the
              comfort of your home or office.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, idx) => (
              <Reveal key={item.step} delay={idx * 100}>
                <div className="group relative">
                  {/* Connector line */}
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute left-[3.5rem] top-8 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-gold-300 via-gold-200 to-transparent lg:block" />
                  )}

                  {/* Step circle */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 shadow-premium transition-all duration-300 group-hover:bg-gold-500 group-hover:shadow-lg group-hover:shadow-gold-500/30">
                    <span className="font-display text-xl font-extrabold text-gold-400 transition-colors duration-300 group-hover:text-navy-900">
                      {item.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-5 flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-gold-600" />

                    <h3 className="font-display text-base font-bold text-navy-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-navy-500">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ======================================================
              CTA BANNER
          ====================================================== */}
          <Reveal delay={150}>
            <div className="relative mt-16 overflow-hidden rounded-3xl bg-navy-900 p-8 text-center lg:p-16">
              <div className="absolute inset-0 bg-grid opacity-30" />

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

              <div className="relative">
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  Ready to get started?
                </h3>

                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-200">
                  Apply online today and let our experts handle your business
                  documentation with speed and precision.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={() => handleApply()}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/40 active:scale-[0.97]"
                  >
                    Apply Now

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate('track')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.97]"
                  >
                    <FileText className="h-4 w-4" />
                    Track Application
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          CONTACT STRIP
      ======================================================== */}
      <section className="bg-navy-50 py-12 lg:py-16">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-premium transition-all duration-300 hover:border-gold-200 hover:shadow-premium-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 transition-colors group-hover:bg-gold-500">
                  <Phone className="h-5 w-5 text-gold-400 transition-colors group-hover:text-navy-900" />
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-navy-400">
                    Call Us
                  </div>

                  <div className="text-sm font-bold text-navy-900">
                    {BUSINESS.phoneDisplay}
                  </div>
                </div>
              </a>

              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-premium transition-all duration-300 hover:border-[#25D366]/30 hover:shadow-premium-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-navy-400">
                    WhatsApp
                  </div>

                  <div className="text-sm font-bold text-navy-900">
                    Chat with us
                  </div>
                </div>
              </a>

              <div className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-premium transition-all duration-300 hover:border-gold-200 hover:shadow-premium-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 transition-colors group-hover:bg-gold-500">
                  <MapPin className="h-5 w-5 text-gold-400 transition-colors group-hover:text-navy-900" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wider text-navy-400">
                    Visit Us
                  </div>

                  <div className="truncate text-sm font-bold text-navy-900">
                    Shahada, Maharashtra
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================
          CUSTOMER REVIEWS
      ======================================================== */}
      {reviews.length > 0 && (
        <section
          id="reviews"
          className="scroll-mt-24 overflow-hidden bg-navy-50 py-14 lg:py-18"
        >
          <div className="container-x">
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-wider text-gold-700">
                Customer Reviews
              </div>

              <h2 className="mt-2 font-display text-3xl font-extrabold text-navy-900">
                Trusted by Our Customers
              </h2>

              <p className="mx-auto mt-2 max-w-2xl text-sm text-navy-500">
                Genuine customer feedback, presented in a smooth review
                stream.
              </p>
            </div>

            <div
              className="review-marquee mt-8"
              aria-label="Customer reviews"
            >
              <div className="review-marquee-track">
                {[...reviews, ...reviews].map(
                  (review: any, index: number) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="review-marquee-card"
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-navy-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-navy-700">
                        “{review.review_text}”
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        {review.avatar_url ? (
                          <img
                            src={review.avatar_url}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-700">
                            {review.customer_name.slice(0, 1)}
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-bold text-navy-900">
                            {review.customer_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}