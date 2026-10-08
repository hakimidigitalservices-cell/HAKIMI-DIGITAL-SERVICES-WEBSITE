import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route, navigateTo } from '@/lib/router';

const QUICK_LINKS: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'About Us', route: 'about' },
  { label: 'Services', route: 'services' },
  { label: 'Pricing', route: 'pricing' },
  { label: 'How It Works', route: 'how-it-works' },
  { label: 'Track Application', route: 'track' },
  { label: 'Contact Us', route: 'contact' },
];

const SERVICE_LINKS = [
  'Udyam Registration',
  'FSSAI License',
  'GST Registration',
  'Shop Act License',
  'Company Registration',
  'Trademark Registration',
];

export default function Footer({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500">
                <span className="font-display text-lg font-extrabold text-navy-900">H</span>
              </div>
              <div className="leading-none">
                <div className="font-display text-base font-extrabold text-white">HAKIMI</div>
                <div className="text-[10px] font-semibold tracking-[0.15em] text-gold-400">
                  DIGITAL SERVICES
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              Your trusted partner for business documentation, government registrations, and
              compliance services across India.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 transition-colors hover:bg-gold-500 hover:text-navy-900"
                aria-label="Call us"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 transition-colors hover:bg-[#25D366] hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => navigate('services')}
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Contact
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-navy-300">{BUSINESS.address}</p>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300"
              >
                <Phone className="h-4 w-4" />
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="text-xs text-navy-400">
            We are a private digital service provider and are not affiliated with any government
            body.
          </p>
        </div>
      </div>
    </footer>
  );
}
