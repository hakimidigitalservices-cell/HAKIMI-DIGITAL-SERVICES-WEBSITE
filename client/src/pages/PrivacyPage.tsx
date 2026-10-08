import { ArrowLeft, ShieldCheck, Lock, FileText, Eye, Mail } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

const SECTIONS = [
  {
    icon: FileText,
    title: 'Information We Collect',
    content: [
      'Personal information such as your full name, mobile number, WhatsApp number, email address, state, and city when you submit an application.',
      'Documents you upload as part of your application, such as identity proofs, address proofs, and business-related documents.',
      'Application details including the selected service, application status, and any correspondence related to your application.',
    ],
  },
  {
    icon: Lock,
    title: 'How We Use Your Information',
    content: [
      'To process your applications and provide the documentation services you request.',
      'To communicate with you about your application status and any updates.',
      'To maintain records of your applications for reference and support purposes.',
      'To improve our services and user experience.',
    ],
  },
  {
    icon: Eye,
    title: 'Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We may share your information with relevant authorities or agencies only as required to process your applications.',
      'We may disclose information if required by law or legal proceedings.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Data Security',
    content: [
      'We use secure, encrypted connections for data transmission.',
      'Your documents are stored in secure cloud storage with access controls.',
      'Access to your personal information is restricted to authorized personnel only.',
    ],
  },
  {
    icon: Mail,
    title: 'Your Rights',
    content: [
      'You have the right to access your personal information.',
      'You can request corrections to your personal data.',
      'You can request deletion of your data, subject to legal requirements.',
      'You can opt out of marketing communications at any time.',
    ],
  },
];

export default function PrivacyPage({ navigate }: { navigate: (r: Route) => void }) {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-navy-400">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-navy-600">
              {BUSINESS.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, and
              safeguard your personal information when you use our services.
            </p>
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
              If you have any questions about this Privacy Policy or our data practices, please
              contact us:
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
