'use client';

import { useState } from 'react';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { syncStaffFromSqlAction } from '@/lib/actions';

export default function StaffSyncButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSync() {
    setStatus('loading');
    const res = await syncStaffFromSqlAction();
    if (res.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={status === 'loading'}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition active:scale-95 ${
        status === 'loading' ? 'bg-white/5 border-white/10 text-white/80' :
        status === 'success' ? 'bg-pitch-green/20 border-pitch-green/40 text-pitch-green shadow-[0_0_20px_rgba(52,211,153,0.1)]' :
        status === 'error' ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' :
        'bg-white/5 border-white/10 text-white/70 hover:bg-gold/10 hover:border-gold/40 hover:text-gold'
      }`}
    >
      {status === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : 
       status === 'success' ? <Check size={16} /> :
       status === 'error' ? <AlertTriangle size={16} /> :
       <RefreshCw size={16} />}
      
      <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">
        {status === 'loading' ? 'Synchro en cours...' : 
         status === 'success' ? 'Base Synchronisée' :
         status === 'error' ? 'Échec Synchro' :
         'Synchroniser la Base'}
      </span>
    </button>
  );
}
