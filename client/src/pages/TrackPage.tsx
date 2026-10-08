import { useState } from 'react';
import {
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Copy,
} from 'lucide-react';
import { BUSINESS, APPLICATION_STATUSES, type ApplicationStatus } from '@/lib/constants';
import { type Route } from '@/lib/router';
import { supabase } from '@/lib/supabase';

type Application = {
  application_id: string;
  service: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email: string;
  state: string;
  city: string;
  status: string;
  document_url: string | null;
  document_name: string | null;
  notes: string | null;
  created_at: string;
};

const STATUS_CONFIG: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string; ring: string }
> = {
  'Application Received': { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200' },
  'Documents Under Verification': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' },
  Processing: { icon: Loader2, color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  Submitted: { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-200' },
  Completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200' },
  'Rejected / Action Required': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200' },
};

export default function TrackPage({ navigate }: { navigate: (r: Route) => void }) {
  const [applicationId, setApplicationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId.trim()) {
      setError('Please enter your Application ID');
      return;
    }

    setLoading(true);
    setError(null);
    setApplication(null);

    try {
      const { data, error: queryError } = await supabase.rpc('track_application', {
        p_application_id: applicationId.trim(),
      });

      if (queryError) {
        console.error('Track application RPC error:', queryError);
        throw new Error(
          'Application tracking is temporarily unavailable. Please try again or contact support.'
        );
      }

      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        setError('No application found with this Application ID. Please check and try again.');
        return;
      }

      setApplication(result as Application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    if (application) {
      navigator.clipboard.writeText(application.application_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentStatusIndex = application
    ? APPLICATION_STATUSES.indexOf(application.status as ApplicationStatus)
    : -1;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
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
                TRACK YOUR APPLICATION
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Track Application
            </h1>
            <p className="mt-3 text-base text-navy-500">
              Enter your Application ID below to check the current status of your application.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => {
                    setApplicationId(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. HDS-2026-001234"
                  className="w-full rounded-lg border border-navy-200 bg-white py-3.5 pl-12 pr-4 text-sm font-mono font-medium text-navy-900 placeholder-navy-300 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Track Now
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Application result */}
          {application && (
            <div className="mt-8 animate-fade-in-up">
              {/* Status card */}
              <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-lg">
                <div className="bg-navy-900 px-6 py-8 sm:px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-navy-300">
                        Application ID
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-xl font-bold tracking-wider text-gold-400">
                          {application.application_id}
                        </span>
                        <button
                          onClick={copyId}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-navy-200 transition-colors hover:bg-white/20 hover:text-white"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {(() => {
                      const config = STATUS_CONFIG[application.status] ?? STATUS_CONFIG['Application Received'];
                      const Icon = config.icon;
                      return (
                        <div
                          className={`flex items-center gap-2 rounded-full ${config.bg} px-4 py-2 ring-1 ${config.ring}`}
                        >
                          <Icon className={`h-4 w-4 ${config.color} ${application.status === 'Processing' ? 'animate-spin' : ''}`} />
                          <span className={`text-sm font-semibold ${config.color}`}>
                            {application.status}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-6 py-8 sm:px-8">
                  <h3 className="mb-6 font-display text-sm font-bold uppercase tracking-wider text-navy-400">
                    Application Timeline
                  </h3>
                  <div className="space-y-1">
                    {APPLICATION_STATUSES.map((status, idx) => {
                      const config = STATUS_CONFIG[status];
                      const Icon = config.icon;
                      const isCompleted = idx < currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;
                      const isRejected = application.status === 'Rejected / Action Required';

                      return (
                        <div key={status} className="flex gap-4">
                          {/* Timeline line + dot */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                isCompleted
                                  ? 'bg-gold-500 text-navy-900'
                                  : isCurrent && !isRejected
                                    ? `${config.bg} ${config.ring} ring-2`
                                    : isCurrent && isRejected
                                      ? `${config.bg} ${config.ring} ring-2`
                                      : 'bg-navy-50 text-navy-300'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : isCurrent && application.status === 'Processing' ? (
                                <Loader2 className={`h-4 w-4 ${config.color} animate-spin`} />
                              ) : (
                                <Icon className={`h-4 w-4 ${isCurrent ? config.color : 'text-navy-300'}`} />
                              )}
                            </div>
                            {idx < APPLICATION_STATUSES.length - 1 && (
                              <div
                                className={`w-0.5 flex-1 ${
                                  isCompleted ? 'bg-gold-400' : 'bg-navy-100'
                                }`}
                                style={{ minHeight: '32px' }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="pb-6">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-semibold ${
                                  isCompleted
                                    ? 'text-navy-900'
                                    : isCurrent
                                      ? config.color
                                      : 'text-navy-400'
                                }`}
                              >
                                {status}
                              </span>
                              {isCurrent && (
                                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700">
                                  Current
                                </span>
                              )}
                            </div>
                            {isCurrent && (
                              <p className="mt-1 text-xs text-navy-400">
                                {isRejected
                                  ? 'Please contact us for further action regarding your application.'
                                  : 'Your application is currently at this stage.'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application details */}
                <div className="border-t border-navy-100 bg-navy-50 px-6 py-8 sm:px-8">
                  <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-navy-400">
                    Application Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailItem icon={FileText} label="Service" value={application.service} />
                    <DetailItem icon={User} label="Applicant" value={application.full_name} />
                    <DetailItem icon={Phone} label="Mobile" value={application.mobile_number} />
                    <DetailItem icon={Mail} label="Email" value={application.email} />
                    <DetailItem icon={MapPin} label="Location" value={`${application.city}, ${application.state}`} />
                    <DetailItem icon={Calendar} label="Submitted" value={formatDate(application.created_at)} />
                  </div>

                  {application.document_name && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-4">
                      <FileText className="h-5 w-5 text-gold-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-navy-400">Uploaded Document</p>
                        <p className="truncate text-sm font-semibold text-navy-900">
                          {application.document_name}
                        </p>
                      </div>
                      {application.document_url && (
                        <a
                          href={application.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-gold-600 hover:text-gold-700"
                        >
                          View
                        </a>
                      )}
                    </div>
                  )}

                  {application.notes && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4">
                      <p className="text-xs font-semibold text-amber-700">Notes:</p>
                      <p className="mt-1 text-sm text-amber-800">{application.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1eb855] active:scale-95"
                >
                  Contact on WhatsApp
                </a>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-navy-200 px-6 py-3.5 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 active:scale-95"
                >
                  <Phone className="h-4 w-4" />
                  Call {BUSINESS.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
        <Icon className="h-4 w-4 text-navy-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-navy-400">{label}</p>
        <p className="truncate text-sm font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  );
}
