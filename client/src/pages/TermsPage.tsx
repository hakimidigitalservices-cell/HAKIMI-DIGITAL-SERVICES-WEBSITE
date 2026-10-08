import { ArrowLeft, FileText, CreditCard, ShieldCheck, AlertTriangle, Scale } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

const SECTIONS = [
  {
    icon: FileText,
    title: 'Service Agreement',
    content: [
      'By using our services, you agree to these Terms and Conditions.',
      'We provide documentation assistance services as a private service provider. We are not affiliated with any government body.',
      'Our services include application preparation, document submission assistance, and processing support.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment & Fees',
    content: [
      'Service fees are charged for documentation assistance and processing support.',
      'Government fees, where applicable, are separate from our service charges.',
      'All fees are communicated before application submission. No hidden charges.',
      'Payments are due as agreed upon at the time of application.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Our Responsibilities',
    content: [
      'We will process your application with diligence and care.',
      'We will keep your personal information and documents confidential.',
      'We will provide updates on your application status.',
      'We will assist you throughout the documentation process.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitations',
    content: [
      'We do not guarantee approval of any application. Approvals are at the discretion of the relevant authorities.',
      'Processing times may vary depending on the service and authority involved.',
      'We are not liable for delays caused by incomplete or incorrect information provided by the customer.',
      'We are not responsible for rejections due to eligibility issues or regulatory requirements.',
    ],
  },
  {
    icon: Scale,
    title: 'Customer Responsibilities',
    content: [
      'You must provide accurate and complete information.',
      'You must submit valid and genuine documents.',
      'You are responsible for verifying the eligibility for the requested service.',
      'You must respond to any queries or requests for additional information promptly.',
    ],
  },
];

export default function TermsPage({ navigate }: { navigate: (r: Route) => void }) {
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

        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-gold-700">LEGAL</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-3 text-sm text-navy-400">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>Important:</strong> {BUSINESS.name} is a private digital service provider.
                We are not affiliated with, endorsed by, or connected to any government body. We do
                not guarantee approval of any application.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900">
                    <section.icon className="h-5 w-5 text-gold-400" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-navy-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="mt-4 space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                      <span className="text-sm leading-relaxed text-navy-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-navy-900">Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">
              For any questions regarding these Terms &amp; Conditions, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-navy-800">{BUSINESS.name}</p>
              <p className="text-sm text-navy-600">{BUSINESS.address}</p>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="block text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
