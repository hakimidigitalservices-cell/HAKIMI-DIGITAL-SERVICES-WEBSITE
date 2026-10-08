import { Phone, MessageCircle, FileText } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

export default function MobileBottomNav({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="flex items-stretch border-t border-navy-200 bg-white shadow-[0_-4px_20px_rgba(10,22,40,0.08)]">
        <a
          href={`tel:${BUSINESS.phone}`}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-navy-700 transition-colors active:bg-navy-50"
        >
          <Phone className="h-5 w-5" />
          <span className="text-[11px] font-semibold">Call</span>
        </a>
        <a
          href={BUSINESS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[#25D366] transition-colors active:bg-green-50"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-[11px] font-semibold">WhatsApp</span>
        </a>
        <button
          onClick={() => navigate('apply')}
          className="flex flex-1 flex-col items-center justify-center gap-1 bg-gold-500 py-2.5 text-navy-900 transition-colors active:bg-gold-400"
        >
          <FileText className="h-5 w-5" />
          <span className="text-[11px] font-semibold">Apply Now</span>
        </button>
      </div>
    </div>
  );
}
