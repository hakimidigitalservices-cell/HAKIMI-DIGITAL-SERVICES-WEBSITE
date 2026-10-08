import {
  ShieldCheck,
  Eye,
  Headphones,
  MonitorSmartphone,
  Target,
  Heart,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  Instagram,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'We operate with honesty and transparency in every interaction and transaction.',
  },
  {
    icon: Target,
    title: 'Accuracy',
    description:
      'We ensure every application is complete, correct, and compliant with regulations.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description:
      'Your needs come first. We go the extra mile to make documentation stress-free.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We strive for the highest standards in service quality and delivery.',
  },
];

const HIGHLIGHTS = [
  {
    icon: MonitorSmartphone,
    title: 'Online Application',
    description:
      'Apply from anywhere in India — no office visit required.',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description:
      'Track your application in real-time with full visibility.',
  },
  {
    icon: Headphones,
    title: 'Expert Assistance',
    description:
      'Experienced professionals guiding you at every step.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Documentation',
    description:
      'Your documents are handled with strict confidentiality.',
  },
];

export default function AboutPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
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

        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-gold-700">
              ABOUT US
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Simplifying Business Documentation for India
          </h1>

          <p className="mt-4 text-base leading-relaxed text-navy-500 sm:text-lg">
            {BUSINESS.name} is a private digital services provider dedicated to making business
            registration, government licenses, and compliance services accessible to entrepreneurs
            and businesses across India.
          </p>
        </div>

        {/* Story */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-navy-100 bg-navy-50 p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900">
              Our Story
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-navy-600">
              We started {BUSINESS.name} with a simple mission: to remove the complexity and
              frustration from business documentation. Navigating government registrations, licenses,
              and compliance requirements can be overwhelming — endless forms, unclear requirements,
              and confusing procedures.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-navy-600">
              Our team brings together years of experience in business documentation and digital
              services. We've built a platform that lets you apply online, track your application in
              real-time, and receive expert guidance at every step — all from the comfort of your
              home or office.
            </p>
          </div>

          <div className="rounded-3xl border border-navy-100 bg-navy-900 p-8 text-white">
            <h2 className="font-display text-2xl font-bold">
              Our Mission
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-navy-200">
              To provide reliable, secure, and hassle-free business documentation services that empower
              entrepreneurs and businesses to focus on what they do best — growing their business.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Make documentation simple and accessible',
                'Ensure transparency at every step',
                'Deliver fast and accurate processing',
                'Provide expert support when you need it',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  <span className="text-sm text-navy-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-900">
              Our Core Values
            </h2>

            <p className="mt-3 text-base text-navy-500">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-navy-900/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 transition-colors group-hover:bg-gold-500">
                  <value.icon className="h-7 w-7 text-gold-400 transition-colors group-hover:text-navy-900" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                  {value.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-navy-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-16 rounded-3xl bg-navy-50 p-8 lg:p-12">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-900">
              What Sets Us Apart
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <item.icon className="h-7 w-7 text-gold-600" />
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-navy-900">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram */}
        <div className="mt-12 rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-sm lg:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900">
            <Instagram className="h-8 w-8 text-gold-400" />
          </div>

          <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">
            Follow Us on Instagram
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-500">
            Follow Hakimi Digital Services for the latest updates, services,
            offers, business documentation tips and more.
          </p>

          <a
            href="https://www.instagram.com/hakimidigitalservices/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30"
          >
            <Instagram className="h-5 w-5" />
            @hakimidigitalservices
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />

            <p className="text-sm leading-relaxed text-amber-800">
              <strong>Disclaimer:</strong> {BUSINESS.name} is a private digital service provider. We
              are not affiliated with, endorsed by, or connected to any government body or agency.
              We assist customers with documentation and application preparation as a paid service.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-navy-900 p-8 text-center lg:p-12">
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to get started?
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-base text-navy-200">
            Apply online today and experience hassle-free business documentation.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('apply')}
              className="group flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30 active:scale-95"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
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