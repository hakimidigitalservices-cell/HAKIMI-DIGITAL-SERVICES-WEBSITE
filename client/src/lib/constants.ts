export const BUSINESS = {
  name: 'Hakimi Digital Services',
  phone: '7720849522',
  phoneDisplay: '+91 77208 49522',
  whatsapp: 'https://wa.me/917720849522',
  address: '32 Gala Market, Opp PWD Office, Dondaicha Road, Shahada',
  email: 'contact@hakimidigitalservices.in',
};

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'udyam-registration',
    name: 'Udyam Registration (MSME)',
    description: 'Get your MSME Udyam Registration Certificate online to access government schemes and benefits.',
    icon: 'Building2',
  },
  {
    id: 'fssai-license',
    name: 'FSSAI License',
    description: 'Obtain your Food Safety License to legally operate your food business with compliance.',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'gst-registration',
    name: 'GST Registration',
    description: 'Register for Goods and Services Tax with complete documentation and filing support.',
    icon: 'Receipt',
  },
  {
    id: 'shop-act-license',
    name: 'Shop Act License',
    description: 'Get your Shops and Establishment License to legally run your commercial establishment.',
    icon: 'Store',
  },
  {
    id: 'company-registration',
    name: 'Company Registration',
    description: 'Register your Private Limited, LLP, or Proprietorship firm with full legal compliance.',
    icon: 'Briefcase',
  },
  {
    id: 'trademark-registration',
    name: 'Trademark Registration',
    description: 'Protect your brand identity with trademark registration and intellectual property rights.',
    icon: 'BadgeCheck',
  },
  {
    id: 'iec-registration',
    name: 'IEC Registration (Import Export Code)',
    description: 'Get your Import Export Code to start international trade and expand your business globally.',
    icon: 'Globe',
  },
  {
    id: 'digital-signature',
    name: 'Digital Signature Certificate',
    description: 'Obtain your Digital Signature Certificate for e-filing and online document authentication.',
    icon: 'PenTool',
  },
  {
    id: 'pan-tan-services',
    name: 'PAN / TAN Services',
    description: 'Apply for new PAN or TAN, make corrections, or link your PAN with Aadhaar and other services.',
    icon: 'CreditCard',
  },
  {
    id: 'trade-license',
    name: 'Trade License',
    description: 'Obtain a trade license from your local municipal authority to legally conduct business activities.',
    icon: 'Store',
  },
  {
    id: 'health-trade-license',
    name: 'Health & Trade License',
    description: 'Get health and trade licenses required for businesses dealing with food or public-facing services.',
    icon: 'ClipboardCheck',
  },
  {
    id: 'copyright-registration',
    name: 'Copyright Registration',
    description: 'Register copyright for your original creative works including software, literature, and art.',
    icon: 'FileSignature',
  },
  {
    id: 'document-verification',
    name: 'Document Verification & Attestation',
    description: 'Get your business documents verified, attested, and authenticated for official use.',
    icon: 'FileCheck2',
  },
  {
    id: 'other-documentation',
    name: 'Other Business Documentation',
    description: 'Need something else? We handle all types of business documentation and compliance needs.',
    icon: 'FileText',
  },
];

export const SERVICE_NAMES = SERVICES.map((s) => s.name);

export const APPLICATION_STATUSES = [
  'Application Received',
  'Documents Under Verification',
  'Processing',
  'Submitted',
  'Completed',
  'Rejected / Action Required',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
