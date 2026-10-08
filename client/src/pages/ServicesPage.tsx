import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Tag,
  MessageCircle,
  Briefcase,
  Landmark,
  Receipt,
  Store,
  BadgeCheck,
  MonitorSmartphone,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { type Route } from '@/lib/router';
import ServiceIcon from '@/components/ServiceIcon';
import Reveal from '@/components/Reveal';

type ServiceDetail = {
  id: string;
  name: string;
  description: string;
  icon: string;
  documents: string[];
  processingTime: string;
  startingPrice: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  icon: typeof Briefcase;
  description: string;
  services: ServiceDetail[];
};

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'business-registration',
    name: 'Business Registration',
    icon: Briefcase,
    description: 'Start your business with the right legal structure and registration.',
    services: [
      {
        id: 'company-registration',
        name: 'Company Registration',
        description:
          'Register your Private Limited Company, LLP, or Proprietorship firm with full legal compliance and documentation support.',
        icon: 'Briefcase',
        documents: ['PAN Card of directors/partners', 'Aadhaar Card', 'Address proof', 'Passport-size photographs', 'Registered office address proof'],
        processingTime: '10-15 working days',
        startingPrice: '₹2,499',
      },
      {
        id: 'udyam-registration',
        name: 'Udyam Registration (MSME)',
        description:
          'Get your MSME Udyam Registration Certificate online to access government schemes, subsidies, and business benefits.',
        icon: 'Building2',
        documents: ['Aadhaar Card', 'PAN Card', 'Business name and activity details', 'Business address'],
        processingTime: '1-3 working days',
        startingPrice: '₹499',
      },
      {
        id: 'shop-act-license',
        name: 'Shop Act License',
        description:
          'Get your Shops and Establishment License to legally operate your commercial establishment within your state.',
        icon: 'Store',
        documents: ['Identity proof (Aadhaar/PAN)', 'Address proof', 'Premises rental agreement or ownership proof', 'Passport-size photograph'],
        processingTime: '5-7 working days',
        startingPrice: '₹999',
      },
    ],
  },
  {
    id: 'government-registrations',
    name: 'Government Registrations',
    icon: Landmark,
    description: 'Essential government registrations required to operate your business legally.',
    services: [
      {
        id: 'iec-registration',
        name: 'IEC Registration (Import Export Code)',
        description:
          'Get your Import Export Code from the DGFT to start international trade and expand your business globally.',
        icon: 'Globe',
        documents: ['PAN Card', 'Aadhaar Card', 'Bank account details', 'Business address proof', 'Cancelled cheque'],
        processingTime: '2-5 working days',
        startingPrice: '₹999',
      },
      {
        id: 'fssai-license',
        name: 'FSSAI License',
        description:
          'Obtain your Food Safety and Standards Authority of India license to legally operate your food business with full compliance.',
        icon: 'UtensilsCrossed',
        documents: ['Identity proof (Aadhaar/PAN)', 'Address proof', 'Business premises proof', 'Food category details', 'Passport-size photograph'],
        processingTime: '7-15 working days',
        startingPrice: '₹999',
      },
      {
        id: 'digital-signature',
        name: 'Digital Signature Certificate',
        description:
          'Obtain your Class 2 or Class 3 Digital Signature Certificate for e-filing, MCA filings, and online document authentication.',
        icon: 'PenTool',
        documents: ['PAN Card', 'Aadhaar Card', 'Passport-size photograph', 'Address proof'],
        processingTime: '1-3 working days',
        startingPrice: '₹499',
      },
    ],
  },
  {
    id: 'tax-compliance',
    name: 'Tax & Compliance',
    icon: Receipt,
    description: 'Stay compliant with tax registrations and filing requirements.',
    services: [
      {
        id: 'gst-registration',
        name: 'GST Registration',
        description:
          'Register for Goods and Services Tax with complete documentation support, GSTIN allocation, and filing guidance.',
        icon: 'Receipt',
        documents: ['PAN Card', 'Aadhaar Card', 'Business address proof', 'Bank account details', 'Cancelled cheque', 'Business constitution proof'],
        processingTime: '5-7 working days',
        startingPrice: '₹999',
      },
      {
        id: 'pan-tan-services',
        name: 'PAN / TAN Services',
        description:
          'Apply for a new PAN or TAN, make corrections to existing cards, or link your PAN with Aadhaar and other services.',
        icon: 'CreditCard',
        documents: ['Aadhaar Card', 'Address proof', 'Passport-size photograph', 'Date of birth proof'],
        processingTime: '5-10 working days',
        startingPrice: '₹499',
      },
    ],
  },
  {
    id: 'licenses',
    name: 'Licenses',
    icon: Store,
    description: 'Industry-specific licenses required for regulated business activities.',
    services: [
      {
        id: 'trade-license',
        name: 'Trade License',
        description:
          'Obtain a trade license from your local municipal authority to legally conduct business activities in your area.',
        icon: 'Store',
        documents: ['Identity proof', 'Address proof', 'Business premises proof', 'Rent agreement or NOC', 'Passport-size photograph'],
        processingTime: '7-15 working days',
        startingPrice: '₹999',
      },
      {
        id: 'health-trade-license',
        name: 'Health & Trade License',
        description:
          'Get health and trade licenses required for businesses dealing with food, healthcare, or public-facing services.',
        icon: 'ClipboardCheck',
        documents: ['Identity proof', 'Address proof', 'Business premises proof', 'Health inspection clearance', 'Staff health certificates'],
        processingTime: '10-20 working days',
        startingPrice: '₹1,499',
      },
    ],
  },
  {
    id: 'intellectual-property',
    name: 'Intellectual Property',
    icon: BadgeCheck,
    description: 'Protect your brand, ideas, and creative work with IP registrations.',
    services: [
      {
        id: 'trademark-registration',
        name: 'Trademark Registration',
        description:
          'Protect your brand name, logo, or tagline with trademark registration and intellectual property rights enforcement.',
        icon: 'BadgeCheck',
        documents: ['Logo or wordmark design', 'Business proof', 'Power of Attorney (TM-48)', 'Applicant details', 'User affidavit if already in use'],
        processingTime: '6-12 months',
        startingPrice: '₹2,499',
      },
      {
        id: 'copyright-registration',
        name: 'Copyright Registration',
        description:
          'Register copyright for your original creative works including software, literature, music, and artistic creations.',
        icon: 'FileSignature',
        documents: ['Work description', 'Author details', 'Proof of creation', 'NOC from co-authors (if applicable)'],
        processingTime: '2-6 months',
        startingPrice: '₹1,999',
      },
    ],
  },
  {
    id: 'digital-services',
    name: 'Digital Services',
    icon: MonitorSmartphone,
    description: 'Digital documentation and online service solutions for your business.',
    services: [
      {
        id: 'other-documentation',
        name: 'Other Business Documentation',
        description:
          'Need something else? We handle all types of business documentation, compliance filings, and regulatory requirements.',
        icon: 'FileText',
        documents: ['Varies based on your specific requirement', 'Contact us for a customized document checklist'],
        processingTime: 'Varies by service',
        startingPrice: '₹499',
      },
      {
        id: 'document-verification',
        name: 'Document Verification & Attestation',
        description:
          'Get your business documents verified, attested, and authenticated for official use across India and internationally.',
        icon: 'FileCheck2',
        documents: ['Original documents for verification', 'Identity proof', 'Authorization letter', 'Supporting business proof'],
        processingTime: '3-7 working days',
        startingPrice: '₹799',
      },
    ],
  },
];

const ALL_CATEGORY_ID = 'all';

export default function ServicesPage({ navigate }: { navigate: (r: Route) => void }) {
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY_ID);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase
        .from('service_catalog')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (active && data) {
        setLiveServices(data);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // One common Apply handler for every Apply Now button on this page.
  // If the customer is logged in, go directly to Apply.
  // If not logged in, send them to Customer Login and return to Apply after login.
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

  const visibleCategories =
    activeCategory === ALL_CATEGORY_ID
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">
        <button
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Header */}
        <Reveal className="text-center">
          <span className="eyebrow">All Services</span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-500">
            Comprehensive business documentation, government registration, and compliance services
            — categorized for easy access, all handled by experts.
          </p>
        </Reveal>

        {liveServices.length > 0 && (
          <section className="mt-12">
            <Reveal>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">Live Pricing</span>
                  <h2 className="mt-3 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Services & Prices</h2>
                  <p className="mt-2 text-sm text-navy-500">Latest services and prices published by Hakimi Digital Services.</p>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liveServices.map((service: any, idx: number) => (
                <Reveal key={service.id} delay={idx * 50}>
                  <div className="card-premium group relative flex h-full flex-col overflow-hidden p-6">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-500 to-gold-300" />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50">
                        <ServiceIcon name={service.icon || 'FileText'} className="h-6 w-6 text-navy-700" />
                      </div>
                      {service.badge && <span className="rounded-full bg-gold-100 px-2.5 py-1 text-xs font-bold text-gold-800">{service.badge}</span>}
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{service.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{service.description}</p>
                    {service.price != null && (
                      <div className="mt-4 flex items-baseline gap-2">
                        <strong className="text-2xl text-navy-900">₹{Number(service.price).toLocaleString('en-IN')}</strong>
                        {service.old_price != null && <span className="text-sm text-navy-400 line-through">₹{Number(service.old_price).toLocaleString('en-IN')}</span>}
                      </div>
                    )}
                    <button onClick={() => handleApply(service.name)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-800">Apply Now <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Category filter */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setActiveCategory(ALL_CATEGORY_ID)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeCategory === ALL_CATEGORY_ID
                  ? 'bg-navy-900 text-white shadow-premium'
                  : 'border border-navy-200 bg-white text-navy-600 hover:border-gold-300 hover:text-navy-900'
              }`}
            >
              All Services
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-navy-900 text-white shadow-premium'
                    : 'border border-navy-200 bg-white text-navy-600 hover:border-gold-300 hover:text-navy-900'
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Service categories */}
        <div className="mt-14 space-y-16">
          {visibleCategories.map((category, catIdx) => (
            <div key={category.id}>
              {/* Category header */}
              <Reveal>
                <div className="flex items-center gap-4 border-b border-navy-100 pb-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-navy-900 shadow-premium">
                    <category.icon className="h-6 w-6 text-gold-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-navy-300">
                        {String(catIdx + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl">
                        {category.name}
                      </h2>
                    </div>
                    <p className="mt-0.5 text-sm text-navy-500">{category.description}</p>
                  </div>
                </div>
              </Reveal>

              {/* Service cards */}
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {category.services.map((service, idx) => (
                  <Reveal key={service.id} delay={idx * 80}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:border-gold-200">
                      {/* Top: icon + name + price */}
                      <div className="flex items-start justify-between gap-4 border-b border-navy-50 p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-navy-50 transition-all duration-300 group-hover:bg-navy-900">
                            <ServiceIcon
                              name={service.icon}
                              className="h-7 w-7 text-navy-700 transition-colors duration-300 group-hover:text-gold-400"
                            />
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold leading-tight text-navy-900">
                              {service.name}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                                <Tag className="h-3 w-3" />
                                {service.startingPrice}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-navy-400">
                                <Clock className="h-3 w-3" />
                                {service.processingTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: description */}
                      <div className="flex-1 p-6 pt-5">
                        <p className="text-sm leading-relaxed text-navy-500">
                          {service.description}
                        </p>

                        {/* Documents */}
                        <div className="mt-5">
                          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy-400">
                            <FileText className="h-3.5 w-3.5" />
                            Required Documents
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {service.documents.map((doc) => (
                              <li key={doc} className="flex items-start gap-2.5">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                                <span className="text-sm text-navy-600">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom: Apply Now */}
                      <div className="border-t border-navy-50 p-6 pt-4">
                        <button
                          onClick={() => handleApply(service.name)}
                          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3.5 text-sm font-bold text-navy-900 transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30 active:scale-[0.97]"
                        >
                          Apply Now
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={100}>
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-navy-900 p-8 text-center lg:p-14">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

            <div className="relative">
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Can't find what you're looking for?
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-200">
                We handle all types of business documentation and compliance needs. Contact us and
                we'll help you with your specific requirements.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => handleApply()}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-7 py-4 text-sm font-bold text-navy-900 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/40 active:scale-[0.97]"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 active:scale-[0.97]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Pricing note */}
        <Reveal delay={150}>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm leading-relaxed text-blue-800">
              <strong className="font-semibold">Pricing note:</strong> Starting prices shown are
              indicative service charges for documentation assistance only. Government fees, where
              applicable, are separate and vary by service. Final pricing depends on your specific
              requirements. Contact us for a detailed quote.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
