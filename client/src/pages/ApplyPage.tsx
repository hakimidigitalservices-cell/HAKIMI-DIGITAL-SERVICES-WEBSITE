import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  Copy,
  AlertCircle,
  Loader2,
  X,
  ArrowLeft,
} from 'lucide-react';

import { BUSINESS, SERVICE_NAMES } from '@/lib/constants';
import { type Route } from '@/lib/router';
import { supabase } from '@/lib/supabase';

type FormState = {
  service: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email: string;
  state: string;
  city: string;
};

type SubmitResult = {
  applicationId: string;
  service: string;
  fullName: string;
};

/* =========================================================
   BUSINESS COMBO PACKAGES
========================================================= */

const COMBO_PACKAGES = [
  'Starter Combo',
  'Business Essential Combo',
  'Business Pro Combo',
  'Premium Business Combo',
];

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM: FormState = {
  service: '',
  full_name: '',
  mobile_number: '',
  whatsapp_number: '',
  email: '',
  state: '',
  city: '',
};

/* =========================================================
   INDIAN STATES
========================================================= */

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
];

/* =========================================================
   APPLY PAGE
========================================================= */

export default function ApplyPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<SubmitResult | null>(null);

  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =========================================================
     LOAD USER + PRESELECT SERVICE
  ========================================================== */

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      const { data } = await supabase.auth.getSession();

      /* -------------------------------------------------------
         Customer login required
      ------------------------------------------------------- */

      if (!data.session) {
        if (active) {
          sessionStorage.setItem('hds_after_login', 'apply');
          navigate('customer-login');
        }

        return;
      }

      /* -------------------------------------------------------
         Logged-in customer details
      ------------------------------------------------------- */

      if (active) {
        const user = data.session.user;
        const meta = user.user_metadata || {};

        const storedService =
          sessionStorage.getItem('hds_apply_service');

        setForm((prev) => ({
          ...prev,

          full_name:
            prev.full_name ||
            meta.full_name ||
            meta.name ||
            '',

          mobile_number:
            prev.mobile_number ||
            meta.mobile_number ||
            '',

          whatsapp_number:
            prev.whatsapp_number ||
            meta.whatsapp_number ||
            meta.mobile_number ||
            '',

          email:
            prev.email ||
            user.email ||
            '',
        }));

        /* -------------------------------------------------------
           Pre-select service/package from Pricing Page
        ------------------------------------------------------- */

        if (storedService) {
          setForm((prev) => ({
            ...prev,
            service: prev.service || storedService,
          }));

          sessionStorage.removeItem('hds_apply_service');
        }
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [navigate]);

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================== */

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError(null);
  };

  /* =========================================================
     FILE UPLOAD
  ========================================================== */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    setFile(selected);
    setError(null);
  };

  /* =========================================================
     REMOVE FILE
  ========================================================== */

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================== */

  const validate = (): string | null => {
    if (!form.service) {
      return 'Please select a service';
    }

    if (!form.full_name.trim()) {
      return 'Please enter your full name';
    }

    if (!form.mobile_number.trim()) {
      return 'Please enter your mobile number';
    }

    if (!/^\d{10}$/.test(form.mobile_number.trim())) {
      return 'Mobile number must be 10 digits';
    }

    if (!form.whatsapp_number.trim()) {
      return 'Please enter your WhatsApp number';
    }

    if (!/^\d{10}$/.test(form.whatsapp_number.trim())) {
      return 'WhatsApp number must be 10 digits';
    }

    if (!form.email.trim()) {
      return 'Please enter your email';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return 'Please enter a valid email address';
    }

    if (!form.state) {
      return 'Please select your state';
    }

    if (!form.city.trim()) {
      return 'Please enter your city';
    }

    return null;
  };

  /* =========================================================
     SUBMIT APPLICATION
  ========================================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let documentUrl: string | null = null;
      let documentName: string | null = null;

      /* -------------------------------------------------------
         Upload document
      ------------------------------------------------------- */

      if (file) {
        const fileExt =
          file.name.split('.').pop() || 'file';

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from('application-documents')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(
            'Failed to upload document. Please try again.'
          );
        }

        const { data: urlData } =
          supabase.storage
            .from('application-documents')
            .getPublicUrl(fileName);

        documentUrl = urlData.publicUrl;
        documentName = file.name;
      }

      /* -------------------------------------------------------
         Submit Application
      ------------------------------------------------------- */

      const {
        data: applicationId,
        error: submitError,
      } = await supabase.rpc(
        'submit_application',
        {
          p_service: form.service,

          p_full_name:
            form.full_name.trim(),

          p_mobile_number:
            form.mobile_number.trim(),

          p_whatsapp_number:
            form.whatsapp_number.trim(),

          p_email:
            form.email.trim(),

          p_state:
            form.state,

          p_city:
            form.city.trim(),

          p_document_url:
            documentUrl,

          p_document_name:
            documentName,
        }
      );

      if (submitError) {
        console.error(
          'submit_application RPC error:',
          submitError
        );

        throw new Error(
          submitError.message ||
            'Failed to submit application. Please try again.'
        );
      }

      if (!applicationId) {
        throw new Error(
          'Application was submitted but no Application ID was returned.'
        );
      }

      /* -------------------------------------------------------
         Send Email
      ------------------------------------------------------- */

      try {
        const {
          error: emailError,
        } = await supabase.functions.invoke(
          'send-application-email',
          {
            body: {
              application_id:
                String(applicationId),

              service:
                form.service,

              full_name:
                form.full_name.trim(),

              mobile_number:
                form.mobile_number.trim(),

              whatsapp_number:
                form.whatsapp_number.trim(),

              email:
                form.email.trim(),

              state:
                form.state,

              city:
                form.city.trim(),
            },
          }
        );

        if (emailError) {
          console.warn(
            'Application email could not be sent:',
            emailError
          );
        }
      } catch (emailError) {
        console.warn(
          'Application email request failed:',
          emailError
        );
      }

      /* -------------------------------------------------------
         Success
      ------------------------------------------------------- */

      setResult({
        applicationId:
          String(applicationId),

        service:
          form.service,

        fullName:
          form.full_name.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     COPY APPLICATION ID
  ========================================================== */

  const copyApplicationId = () => {
    if (!result) return;

    navigator.clipboard.writeText(
      result.applicationId
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /* =========================================================
     SUCCESS SCREEN
  ========================================================== */

  if (result) {
    return (
      <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
        <div className="container-x py-12 lg:py-16">
          <div className="mx-auto max-w-2xl">

            <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-xl">

              {/* Success Header */}
              <div className="bg-navy-900 px-8 py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-500">
                  <CheckCircle2 className="h-10 w-10 text-navy-900" />
                </div>

                <h1 className="mt-6 font-display text-2xl font-extrabold text-white">
                  Application Submitted Successfully
                </h1>

                <p className="mt-2 text-sm text-navy-300">
                  Your application has been received and is now being processed.
                </p>
              </div>

              {/* Application Details */}
              <div className="px-8 py-8">

                <div className="rounded-2xl bg-navy-50 p-6">

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy-500">
                      Application ID
                    </span>

                    <button
                      type="button"
                      onClick={copyApplicationId}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 font-mono text-2xl font-bold tracking-wider text-navy-900">
                    {result.applicationId}
                  </div>
                </div>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                    <span className="text-sm text-navy-500">
                      Selected Service
                    </span>

                    <span className="text-right text-sm font-semibold text-navy-900">
                      {result.service}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                    <span className="text-sm text-navy-500">
                      Applicant Name
                    </span>

                    <span className="text-sm font-semibold text-navy-900">
                      {result.fullName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-navy-100 pb-4">
                    <span className="text-sm text-navy-500">
                      Expected Processing Status
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Application Received
                    </span>
                  </div>

                </div>

                <div className="mt-6 rounded-xl bg-gold-50 p-4">
                  <p className="text-sm leading-relaxed text-navy-700">
                    <strong>
                      Please save your Application ID.
                    </strong>{' '}
                    You can use it to track your application
                    status anytime on our Track Application page.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => navigate('track')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 active:scale-95"
                  >
                    Track Application
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-navy-200 px-6 py-3.5 text-sm font-semibold text-navy-800 transition-all hover:border-gold-400 active:scale-95"
                  >
                    Contact on WhatsApp
                  </a>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     APPLICATION FORM
  ========================================================== */

  return (
    <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24">
      <div className="container-x py-12 lg:py-16">

        <div className="mx-auto max-w-3xl">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-navy-500 transition-colors hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-1.5">
              <span className="text-xs font-semibold tracking-wide text-gold-700">
                ONLINE APPLICATION
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Apply Now
            </h1>

            <p className="mt-3 text-base text-navy-500">
              Fill in your details below and upload your documents.
              We'll process your application and keep you updated
              at every step.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* =================================================
                SERVICE SELECTION
            ================================================== */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-navy-900">
                Select Service{' '}
                <span className="text-red-500">*</span>
              </label>

              <select
                value={form.service}
                onChange={(e) =>
                  handleChange(
                    'service',
                    e.target.value
                  )
                }
                className="input-field cursor-pointer"
              >
                <option value="">
                  Choose a service...
                </option>

                {/* ---------------------------------------------
                    COMBO PACKAGES
                ---------------------------------------------- */}

                <optgroup label="Business Combo Packages">

                  <option value="Starter Combo">
                    Starter Combo — ₹799
                  </option>

                  <option value="Business Essential Combo">
                    Business Essential Combo — ₹1,299
                  </option>

                  <option value="Business Pro Combo">
                    Business Pro Combo — ₹3,999
                  </option>

                  <option value="Premium Business Combo">
                    Premium Business Combo — ₹4,999
                  </option>

                </optgroup>

                {/* ---------------------------------------------
                    INDIVIDUAL SERVICES
                ---------------------------------------------- */}

                <optgroup label="Individual Services">

                  {SERVICE_NAMES.map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}

                </optgroup>

              </select>
            </div>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================== */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  Full Name{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    handleChange(
                      'full_name',
                      e.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  className="input-field"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  Mobile Number{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  value={form.mobile_number}
                  onChange={(e) =>
                    handleChange(
                      'mobile_number',
                      e.target.value
                    )
                  }
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  className="input-field"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  WhatsApp Number{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  value={form.whatsapp_number}
                  onChange={(e) =>
                    handleChange(
                      'whatsapp_number',
                      e.target.value
                    )
                  }
                  placeholder="10-digit WhatsApp number"
                  maxLength={10}
                  inputMode="numeric"
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  Email{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange(
                      'email',
                      e.target.value
                    )
                  }
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>

              {/* State */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  State{' '}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  value={form.state}
                  onChange={(e) =>
                    handleChange(
                      'state',
                      e.target.value
                    )
                  }
                  className="input-field cursor-pointer"
                >
                  <option value="">
                    Select your state...
                  </option>

                  {INDIAN_STATES.map((state) => (
                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-navy-900">
                  City{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    handleChange(
                      'city',
                      e.target.value
                    )
                  }
                  placeholder="Enter your city"
                  className="input-field"
                />
              </div>

            </div>

            {/* =================================================
                DOCUMENT UPLOAD
            ================================================== */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-semibold text-navy-900">
                Document Upload{' '}
                <span className="text-navy-400">
                  (Optional)
                </span>
              </label>

              <p className="mb-3 text-xs text-navy-400">
                Upload Aadhaar, PAN, address proof, or any
                relevant documents. Max 10MB. PDF, JPG, PNG
                accepted.
              </p>

              {!file ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 px-6 py-10 transition-colors hover:border-gold-400 hover:bg-gold-50"
                >
                  <Upload className="h-8 w-8 text-navy-400" />

                  <span className="text-sm font-medium text-navy-600">
                    Click to upload your document
                  </span>

                  <span className="text-xs text-navy-400">
                    or drag and drop
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-navy-200 bg-navy-50 p-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100">
                    <FileText className="h-5 w-5 text-gold-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {file.name}
                    </p>

                    <p className="text-xs text-navy-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />

            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-4 text-sm font-bold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Terms */}
            <p className="mt-4 text-center text-xs text-navy-400">
              By submitting, you agree to our Terms &
              Conditions and Privacy Policy. We are not
              affiliated with any government body.
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}