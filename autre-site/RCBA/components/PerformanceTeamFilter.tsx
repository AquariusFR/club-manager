'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Users } from 'lucide-react';

interface Team {
  id: number;
  nom: string;
}

export default function PerformanceTeamFilter({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTeamId = searchParams.get('team') || 'all';

  const handleTeamChange = (teamId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (teamId === 'all') {
      params.delete('team');
    } else {
      params.set('team', teamId);
    }
    // Maintain days filter if present
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:border-blue-500/30 transition group shadow-lg">
      <Users size={16} className={`${currentTeamId !== 'all' ? 'text-blue-400' : 'text-white/40'} group-hover:scale-110 transition-transform`} />
      <select
        value={currentTeamId}
        onChange={(e) => handleTeamChange(e.target.value)}
        className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none cursor-pointer pr-2 italic"
      >
        <option value="all" className="bg-slate-900 italic">TOUTES LES ÉQUIPES</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id.toString()} className="bg-slate-900">
            {team.nom.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
