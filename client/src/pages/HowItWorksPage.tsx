import { ArrowRight, ArrowLeft, FileText, Upload, Cog, Award } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

const STEPS = [
  {
    icon: FileText,
    step: '01',
    title: 'Choose Your Service',
    description:
      'Browse our comprehensive list of services and select the one that matches your business needs. Not sure which one you need? Our experts can help you decide.',
    details: [
      '10+ documentation services available',
      'Expert guidance to choose the right service',
      'Clear descriptions of what each service includes',
    ],
  },
  {
    icon: Upload,
    step: '02',
    title: 'Submit Documents',
    description:
      'Fill out the online application form with your details and upload your documents securely. No office visit required — everything happens online.',
    details: [
      'Simple online application form',
      'Secure document upload',
      'Submit from anywhere in India',
    ],
  },
  {
    icon: Cog,
    step: '03',
    title: 'We Process Your Application',
    description:
      'Our team of experts reviews your application, verifies your documents, and processes everything with the relevant authorities. You can track progress in real-time.',
    details: [
      'Expert review and verification',
      'Real-time status tracking',
      'Application ID for reference',
      'Updates at every stage',
    ],
  },
  {
    icon: Award,
    step: '04',
    title: 'Receive Your Certificate',
    description:
      'Once processing is complete, you receive your certificate or document. We ensure everything is delivered to you promptly and securely.',
    details: [
      'Digital delivery of certificates',
      'Confirmation upon completion',
      'Ongoing support for any queries',
    ],
  },
];

export default function HowItWorksPage({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">
        <button
          onClick={() => navigate('home')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-gold-700">HOW IT WORKS</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            A Simple 4-Step Process
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-navy-500">
            From choosing your service to receiving your certificate — here's exactly how we make
            business documentation effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 space-y-8">
          {STEPS.map((step, idx) => (
            <div key={step.step} className="relative">
              {idx < STEPS.length - 1 && (
                <div className="absolute left-[2.75rem] top-20 hidden h-[calc(100%-2rem)] w-0.5 bg-gradient-to-b from-gold-300 to-navy-100 lg:block" />
              )}
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                {/* Step number + icon */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-navy-900">
                    <step.icon className="h-8 w-8 text-gold-400" />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 font-display text-xs font-extrabold text-navy-900">
                      {step.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2">
                  <h2 className="font-display text-2xl font-bold text-navy-900">{step.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-navy-500">
                    {step.description}
                  </p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2.5 rounded-lg bg-navy-50 px-4 py-2.5"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        <span className="text-sm text-navy-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-navy-900 p-8 text-center lg:p-12">
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to begin?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base text-navy-200">
            Start your application today and get your documentation done the easy way.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('apply')}
              className="group flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30 active:scale-95"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 active:scale-95"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
