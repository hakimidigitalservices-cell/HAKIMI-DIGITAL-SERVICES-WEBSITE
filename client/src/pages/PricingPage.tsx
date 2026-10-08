import { ArrowRight, ArrowLeft, Check, Info, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

type PriceTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const PRICE_TIERS: PriceTier[] = [
  {
    name: 'Starter Combo',
    price: '₹799',
    description: 'Essential registrations for starting your business.',
    features: [
      'Shop Act License',
      'Udyam Registration',
      'Free Document Verification',
      'PDF Certificate Copy',
      'WhatsApp Support',
      'All India Online Service',
      'Transparent Pricing',
    ],
  },
  {
    name: 'Business Essential Combo',
    price: '₹1,299',
    description: 'Complete basic compliance package for your business.',
    features: [
      'Shop Act License',
      'Udyam Registration',
      'FSSAI License (1 Year)',
      'Free Document Verification',
      'PDF Certificate Copy',
      'WhatsApp Support',
      'All India Online Service',
      'Transparent Pricing',
    ],
  },
  {
    name: 'Business Pro Combo',
    price: '₹3,999',
    description: 'Complete business registration and compliance package.',
    features: [
      'Shop Act License',
      'Udyam Registration',
      'FSSAI License (1 Year)',
      'GST Registration',
      'Priority Processing',
      'Business Consultation',
      '1 Year WhatsApp Support',
      'Free Document Verification',
      'PDF Certificate Copy',
      'All India Online Service',
    ],
    popular: true,
  },
  {
    name: 'Premium Business Combo',
    price: '₹4,999',
    description: 'Premium business compliance package with extended support.',
    features: [
      'Shop Act License',
      'Udyam Registration',
      'FSSAI License (5 Years)',
      'GST Registration',
      'Priority Processing',
      'Business Consultation',
      '1 Year WhatsApp Support',
      'Document Review & Corrections',
      'Free Document Verification',
      'PDF Certificate Copy',
      'All India Online Service',
    ],
  },
];

const NOTE =
  'Prices are indicative service charges for documentation assistance only. Government fees, if applicable, are separate and vary by service. Final pricing depends on your specific requirements. Contact us for a detailed quote.';

export default function PricingPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const [services, setServices] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all([
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
    ]).then(([serviceRes, offerRes]) => {
      if (!active) return;

      if (!serviceRes.error && serviceRes.data) {
        setServices(serviceRes.data);
      }

      if (!offerRes.error && offerRes.data) {
        setOffers(offerRes.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  /*
   * Apply Now flow:
   *
   * Logged in customer
   *      ↓
   * Apply Page
   *
   * Not logged in
   *      ↓
   * Customer Login
   *      ↓
   * Apply Page
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

  return (
    <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">

        {/* Back to Home */}
        <button
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Page Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-gold-700">
              PRICING
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-navy-500">
            Choose the right business registration and compliance package for
            your requirements.
          </p>
        </div>

        {/* =========================================================
            COMBO PACKAGES
        ========================================================== */}

        <div className="mt-12">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
              <Tag className="h-4 w-4 text-gold-700" />

              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                Business Registration Combo Packages
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PRICE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-7 ${
                  tier.popular
                    ? 'border-gold-400 shadow-lg ring-2 ring-gold-400/20'
                    : 'border-navy-100'
                }`}
              >
                {/* Most Popular */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 shadow-sm">
                    Most Popular
                  </div>
                )}

                {/* Package Name */}
                <h3 className="font-display text-xl font-bold text-navy-900">
                  {tier.name}
                </h3>

                {/* Description */}
                <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-navy-500">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mt-5">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-navy-900">
                    {tier.price}
                  </span>

                  <span className="ml-1 text-sm text-navy-400">
                    only
                  </span>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => handleApply()}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
                    tier.popular
                      ? 'bg-gold-500 text-navy-900 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30'
                      : 'bg-navy-900 text-white hover:bg-navy-800'
                  }`}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Features */}
                <ul className="mt-7 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                        <Check
                          className="h-3 w-3 text-gold-700"
                          strokeWidth={3}
                        />
                      </div>

                      <span className="text-sm leading-relaxed text-navy-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            LIVE SERVICE PRICING
        ========================================================== */}

        {services.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center rounded-full bg-navy-100 px-4 py-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Individual Service Pricing
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter(
                  (service: any) =>
                    !offers.some(
                      (offer: any) =>
                        offer.is_active &&
                        (
                          (offer.service_id &&
                            offer.service_id === service.id) ||
                          (offer.service_name &&
                            String(offer.service_name).toLowerCase() ===
                              String(service.name).toLowerCase())
                        )
                    )
                )
                .map((service: any) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-navy-900">
                          {service.name}
                        </h3>

                        {service.description && (
                          <p className="mt-1 text-sm leading-relaxed text-navy-500">
                            {service.description}
                          </p>
                        )}
                      </div>

                      {service.badge && (
                        <span className="whitespace-nowrap rounded-full bg-gold-100 px-2.5 py-1 text-xs font-bold text-gold-800">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {service.price != null && (
                      <div className="mt-4 flex items-baseline gap-2">
                        <strong className="text-2xl text-navy-900">
                          ₹{Number(service.price).toLocaleString('en-IN')}
                        </strong>

                        {service.old_price != null && (
                          <span className="text-sm text-navy-400 line-through">
                            ₹
                            {Number(service.old_price).toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleApply(service.name)}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 active:scale-95"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================
            ACTIVE OFFERS
        ========================================================== */}

        {offers.length > 0 && (
          <div className="mt-12 rounded-3xl border border-gold-200 bg-gold-50 p-6 lg:p-8">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500">
                <Tag className="h-4 w-4 text-navy-900" />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Active Offers
                </h2>

                <p className="text-sm text-navy-500">
                  Limited-time offers and special service pricing.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer: any) => {
                const linkedService =
                  offer.service_name ||
                  services.find(
                    (service: any) =>
                      service.id === offer.service_id
                  )?.name;

                return (
                  <div
                    key={offer.id}
                    className="rounded-2xl border border-gold-100 bg-white p-5 shadow-sm"
                  >
                    <div className="font-bold text-navy-900">
                      {offer.title}
                    </div>

                    {offer.description && (
                      <div className="mt-1 text-sm leading-relaxed text-navy-500">
                        {offer.description}
                      </div>
                    )}

                    {offer.discount_text && (
                      <div className="mt-2 text-sm font-bold text-gold-700">
                        {offer.discount_text}
                      </div>
                    )}

                    {offer.price != null && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-navy-900">
                          ₹
                          {Number(offer.price).toLocaleString(
                            'en-IN'
                          )}
                        </span>

                        {offer.old_price != null && (
                          <span className="text-sm text-navy-400 line-through">
                            ₹
                            {Number(offer.old_price).toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleApply(linkedService)}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-900 transition-all hover:bg-gold-400 active:scale-95"
                    >
                      Grab This Offer
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            NOTE
        ========================================================== */}

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

          <p className="text-sm leading-relaxed text-blue-800">
            {NOTE}
          </p>
        </div>

        {/* =========================================================
            CUSTOM QUOTE CTA
        ========================================================== */}

        <div className="mt-12 rounded-3xl bg-navy-900 p-8 text-center lg:p-12">
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Need a custom quote?
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-base text-navy-200">
            Contact us with your specific requirements and we'll provide a
            tailored pricing plan.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1eb855] active:scale-95"
            >
              Chat on WhatsApp
            </a>

            <button
              type="button"
              onClick={() => navigate('contact')}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 active:scale-95"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}