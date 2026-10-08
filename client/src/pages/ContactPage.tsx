import { Phone, MessageCircle, MapPin, Mail, Clock, ArrowLeft } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

export default function ContactPage({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate('home')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-gold-700">
                GET IN TOUCH
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-3 text-base text-navy-500">
              Have questions about our services? Reach out to us — we're here to help.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Contact info card */}
            <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-navy-900">
                {BUSINESS.name}
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <MapPin className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Address
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-navy-800">
                      {BUSINESS.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <Phone className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Phone
                    </p>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="mt-1 block text-sm font-semibold text-navy-800 transition-colors hover:text-gold-600"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <Mail className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy-800">
                      {BUSINESS.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <Clock className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Business Hours
                    </p>
                    <p className="mt-1 text-sm text-navy-800">Mon - Sat: 10:00 AM - 7:00 PM</p>
                    <p className="text-sm text-navy-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons card */}
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:border-gold-300 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 transition-colors group-hover:bg-gold-500">
                  <Phone className="h-6 w-6 text-gold-400 transition-colors group-hover:text-navy-900" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-navy-900">Call Us</h3>
                  <p className="text-sm text-navy-500">Speak directly with our team</p>
                  <p className="mt-1 text-sm font-semibold text-gold-600">
                    {BUSINESS.phoneDisplay}
                  </p>
                </div>
              </a>

              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:border-[#25D366]/40 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366] transition-colors">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-navy-900">WhatsApp</h3>
                  <p className="text-sm text-navy-500">Chat with us instantly</p>
                  <p className="mt-1 text-sm font-semibold text-[#25D366]">
                    Start a conversation
                  </p>
                </div>
              </a>

              <button
                onClick={() => navigate('apply')}
                className="group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:border-gold-300 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500">
                  <span className="font-display text-xl font-extrabold text-navy-900">H</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-display text-lg font-bold text-navy-900">Apply Online</h3>
                  <p className="text-sm text-navy-500">Submit your application online</p>
                  <p className="mt-1 text-sm font-semibold text-gold-600">
                    Get started now
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Map embed */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
            <iframe
              title="Hakimi Digital Services Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.4700%2C21.6700%2C74.4900%2C21.6900&layer=mapnik&marker=21.6800%2C74.4800"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
