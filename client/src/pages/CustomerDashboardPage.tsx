import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, Clock3, FileDown, FileText, Headphones, LogOut, MessageCircle, Plus, ShieldCheck, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BUSINESS } from '@/lib/constants';
import { type Route } from '@/lib/router';

type Application = { id:string; application_id:string; service:string; full_name:string; status:string; document_url:string|null; document_name:string|null; notes:string|null; created_at:string; updated_at:string };
type Ticket = { id:string; subject:string; message:string; status:string; created_at:string; admin_reply:string|null };

const statusSteps = ['Application Received','Documents Verified','Processing','Completed'];

export default function CustomerDashboardPage({ navigate }: { navigate: (r: Route) => void }) {
  const [user, setUser] = useState<any>(null); const [apps,setApps]=useState<Application[]>([]); const [tickets,setTickets]=useState<Ticket[]>([]); const [loading,setLoading]=useState(true); const [subject,setSubject]=useState(''); const [ticketMessage,setTicketMessage]=useState(''); const [sending,setSending]=useState(false); const [error,setError]=useState<string|null>(null);
  const load = async () => {
    const { data: { user: current } } = await supabase.auth.getUser();
    if (!current) { navigate('customer-login'); return; }
    setUser(current);
    const [a,t] = await Promise.all([
      supabase.from('applications').select('id,application_id,service,full_name,status,document_url,document_name,notes,created_at,updated_at').eq('user_id',current.id).order('created_at',{ascending:false}),
      supabase.from('support_tickets').select('id,subject,message,status,created_at,admin_reply').eq('user_id',current.id).order('created_at',{ascending:false}),
    ]);
    if (a.error) setError(a.error.message); else setApps((a.data||[]) as Application[]);
    if (!t.error) setTickets((t.data||[]) as Ticket[]);
    setLoading(false);
  };
  useEffect(()=>{ load(); const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{ if(!session) navigate('customer-login'); }); return ()=>subscription.unsubscribe(); },[]);
  const signOut=async()=>{await supabase.auth.signOut(); navigate('home');};
  const createTicket=async(e:FormEvent)=>{e.preventDefault(); if(!subject.trim()||!ticketMessage.trim()||!user)return; setSending(true); setError(null); const {error:e1}=await supabase.from('support_tickets').insert({user_id:user.id,subject:subject.trim(),message:ticketMessage.trim()}); if(e1)setError(e1.message); else {setSubject('');setTicketMessage('');await load();} setSending(false);};
  if(loading)return <div className="min-h-[70vh] pt-28 text-center text-navy-500">Loading your dashboard...</div>;
  return <div className="min-h-screen bg-navy-50 pt-20 lg:pt-24"><div className="container-x py-8 lg:py-12">
    <div className="mb-7 flex flex-col justify-between gap-4 rounded-3xl bg-navy-900 p-7 text-white shadow-xl sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-sm text-gold-300"><ShieldCheck className="h-4 w-4"/> Secure Customer Portal</div><h1 className="mt-2 font-display text-2xl font-extrabold lg:text-3xl">Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h1><p className="mt-1 text-sm text-navy-200">Manage your Hakimi Digital Services applications.</p></div><button onClick={signOut} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"><LogOut className="h-4 w-4"/> Logout</button></div>
    {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="mb-8 grid gap-4 sm:grid-cols-3"><Stat icon={<FileText/>} label="Applications" value={apps.length}/><Stat icon={<Clock3/>} label="In Processing" value={apps.filter(a=>a.status==='Processing').length}/><Stat icon={<CheckCircle2/>} label="Completed" value={apps.filter(a=>a.status==='Completed').length}/></div>
    <div className="grid gap-7 lg:grid-cols-[1.6fr_1fr]">
      <section className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-display text-xl font-extrabold text-navy-900">My Applications</h2><p className="text-sm text-navy-500">Track every application from one screen.</p></div><button onClick={()=>navigate('apply')} className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-900"><Plus className="h-4 w-4"/> New Application</button></div>
        {apps.length===0?<Empty text="No applications are linked to this account yet."/>:<div className="space-y-4">{apps.map(app=><ApplicationCard key={app.id} app={app}/>)}</div>}
      </section>
      <div className="space-y-7">
        <section className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-extrabold text-navy-900">Need Help?</h2><p className="mt-2 text-sm leading-6 text-navy-500">Talk to our team directly for documents, payment or application support.</p><a href={`https://wa.me/91${BUSINESS.phone.replace(/\D/g,'')}?text=Hello%20Hakimi%20Digital%20Services%2C%20I%20need%20support.`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white"><MessageCircle className="h-5 w-5"/> WhatsApp Support</a></section>
        <section className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-gold-600"/><h2 className="font-display text-xl font-extrabold text-navy-900">Support Ticket</h2></div><form onSubmit={createTicket} className="mt-4 space-y-3"><input value={subject} onChange={e=>setSubject(e.target.value)} className="input-field" placeholder="Subject"/><textarea value={ticketMessage} onChange={e=>setTicketMessage(e.target.value)} className="input-field min-h-28" placeholder="How can we help?"/><button disabled={sending} className="w-full rounded-xl bg-navy-900 px-4 py-3 font-bold text-white disabled:opacity-60">{sending?'Sending...':'Send Support Request'}</button></form>{tickets.length>0&&<div className="mt-5 border-t border-navy-100 pt-4 space-y-3">{tickets.slice(0,4).map(t=><div key={t.id} className="rounded-xl bg-navy-50 p-3"><div className="flex justify-between gap-2"><b className="text-sm text-navy-800">{t.subject}</b><span className="text-xs font-semibold text-gold-700">{t.status}</span></div><p className="mt-1 text-xs text-navy-500">{t.message}</p>{t.admin_reply&&<p className="mt-2 rounded-lg bg-white p-2 text-xs text-navy-700"><b>Team:</b> {t.admin_reply}</p>}</div>)}</div>}</section>
      </div>
    </div>
  </div></div>;
}
function Stat({icon,label,value}:{icon:ReactNode;label:string;value:number}){return <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-800">{icon}</div><div className="text-2xl font-extrabold text-navy-900">{value}</div><div className="text-sm text-navy-500">{label}</div></div>}
function Empty({text}:{text:string}){return <div className="rounded-2xl border border-dashed border-navy-200 p-8 text-center text-sm text-navy-500">{text}</div>}
function ApplicationCard({app}:{app:Application}){const current=Math.max(0,statusSteps.indexOf(app.status)); return <div className="rounded-2xl border border-navy-100 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="text-xs font-bold tracking-wider text-gold-600">{app.application_id}</div><h3 className="mt-1 font-bold text-navy-900">{app.service}</h3><p className="text-xs text-navy-500">Applied {new Date(app.created_at).toLocaleDateString('en-IN')}</p></div><span className="self-start rounded-full bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-800">{app.status}</span></div><div className="mt-5 grid grid-cols-4 gap-2">{statusSteps.map((s,i)=><div key={s}><div className={`h-1.5 rounded-full ${i<=current?'bg-gold-500':'bg-navy-100'}`}/><p className="mt-1 text-[10px] leading-3 text-navy-500">{s}</p></div>)}</div>{app.notes&&<div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800"><b>Update:</b> {app.notes}</div>}{app.document_url&&<a href={app.document_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-navy-200 px-3 py-2 text-xs font-bold text-navy-800"><FileDown className="h-4 w-4"/> {app.document_name||'View Document'}</a>}</div>}
