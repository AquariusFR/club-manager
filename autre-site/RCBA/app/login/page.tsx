'use client'

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Loader2, Users2, ShieldCheck, Lock, ChevronRight, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { loginAction, googleLoginAction } from '@/lib/actions';
import MagneticWrapper from '@/components/MagneticWrapper';


function LoginForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl z-10 animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex justify-between items-center mb-10">
        <MagneticWrapper>
          <Link href="/" className="inline-flex items-center gap-4 text-white/70 hover:text-white transition duration-300 active:scale-[0.96] group px-6 py-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-xl">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-white/60">Retour au site</span>
          </Link>
        </MagneticWrapper>
        
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest italic">Portail Unifié</span>
          </div>
        </div>
      </div>

      <div className="glass-card border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl">
        {/* Cinematic Aura Flare inside card */}
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gold blur-[100px] rounded-full opacity-30 pointer-events-none transition duration-1000`} />

        <div className="p-12 md:p-20 relative z-10">
          <div className="mb-14 text-center">
            <div className="mb-8 w-32 h-32 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-2 shadow-2xl relative mx-auto group-hover:border-gold/30 transition duration-700 glass-shine overflow-hidden">
              <img src="/logo.png" alt="RCBA" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-center gap-4 text-gold text-[10px] font-black uppercase tracking-[0.8em] mb-4">
              <span className="w-12 h-[1px] bg-gold/30"></span> Racing Club Bû Abondant <span className="w-12 h-[1px] bg-gold/30"></span>
            </div>
            <h1 className="athletic-title text-4xl md:text-5xl text-white italic leading-tight uppercase tracking-tighter">
              <span>Portail</span> <span className={`text-gold drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>UNIFIÉ</span>
            </h1>
            <p className="text-white/70 text-[10px] sm:text-[11px] mt-6 uppercase font-black tracking-[0.5em] italic leading-relaxed max-w-sm mx-auto">
              "CONNEXION CENTRALISÉE"
            </p>
          </div>

          <div className="space-y-10">
            <form action={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 italic">
                  <ShieldAlert size={20} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.5em] ml-6 italic">Mail ou Identifiant</label>
                <div className="relative group/input">
                  <div className={`absolute inset-0 bg-gold blur-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-3xl pointer-events-none`} />
                  <Users2 className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors duration-500 text-gold opacity-40 group-focus-within/input:opacity-100`} size={22} />
                  <input 
                    name="username" 
                    type="text" 
                    defaultValue={emailParam} 
                    required 
                    className={`w-full bg-white/[0.02] border border-white/10 rounded-full pl-20 pr-8 py-7 text-white text-base font-bold italic focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none focus:border-white/30 group-focus-within/input:bg-white/[0.05] transition placeholder:text-white/80 uppercase tracking-widest`}
                    placeholder="ID UTILISATEUR" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] font-black text-white/80 uppercase tracking-[0.5em] italic">Mot de Passe</label>
                  <Link href="/club/contact" className="text-[9px] font-black text-white/60 hover:text-gold uppercase tracking-widest transition-colors italic focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded">Mot de passe oublié ?</Link>
                </div>
                <div className="relative group/input">
                  <div className={`absolute inset-0 bg-gold blur-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity rounded-3xl pointer-events-none`} />
                  <Lock className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors duration-500 text-gold opacity-40 group-focus-within/input:opacity-100`} size={22} />
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-full pl-20 pr-8 py-7 text-white text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none focus:border-white/30 group-focus-within/input:bg-white/[0.05] transition placeholder:text-white/80" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <MagneticWrapper>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-8 rounded-full font-black text-sm uppercase tracking-[0.8em] shadow-2xl transition duration-300 flex items-center justify-center gap-4 group relative overflow-hidden italic focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none ${
                    loading ? 'bg-white/5 text-white/80' : `bg-white text-navy-deep hover:shadow-white/20 active:scale-[0.96]`
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="animate-pulse">Connexion...</span>
                    </div>
                  ) : (
                    <>AUTORISER L&apos;ACCÈS <ChevronRight size={20} className="group-hover:translate-x-3 transition-transform" /></>
                  )}
                  {/* Glass Shine Effect on Button */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12 pointer-events-none" />
                </button>
              </MagneticWrapper>
            </form>

            <div className="relative flex items-center gap-8 py-2">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-[10px] font-black uppercase text-white/15 tracking-[0.6em] shrink-0 italic">Flux Sécurisé</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>

            <form action={googleLoginAction}>
              <button type="submit" className="w-full py-6 rounded-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition duration-300 flex items-center justify-center gap-5 group active:scale-[0.96] shadow-xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-gold transition-colors">G</div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70 group-hover:text-gold transition-colors italic">Connexion RCBA via Google</span>
              </button>
            </form>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-white/80 group cursor-help">
              <ShieldCheck size={18} className="group-hover:text-pitch-green transition-colors" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">
                Système d'Accès au club <span className="text-white/70">v2.5.12</span>
              </p>
            </div>
            <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em] italic">
              Supervision : Secrétariat RCBA — Expert Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div suppressHydrationWarning className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-black relative overflow-hidden font-body selection:bg-gold/30 selection:text-white">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image 
          src="/stadium-bg.png" 
          alt="RCBA Stadium" 
          fill 
          priority 
          className="object-cover opacity-20 mix-blend-luminosity brightness-75 grayscale-[30%]"
        />
      </div>

      {/* Cinematic Overlays Elements */}
      <div className="absolute inset-0 bg-[#020617]/90 md:bg-[#020617]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-navy-deep via-transparent to-navy-deep opacity-90 pointer-events-none" />
      
      {/* Animated Aura Flares */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gold/5 blur-[160px] rounded-full animate-float opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-pitch-green/5 blur-[160px] rounded-full animate-pulse-slow opacity-30 pointer-events-none" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold/[0.02] blur-[200px] rounded-full pointer-events-none animate-shimmer"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 contrast-150 brightness-150 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Suspense fallback={
        <div className="flex flex-col items-center gap-10 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={32} />
          </div>
          <span className="text-[12px] font-black uppercase tracking-[1em] text-white/70 animate-pulse italic">CHARGEMENT DU PORTAIL...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
