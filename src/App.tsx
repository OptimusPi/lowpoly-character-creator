import Scene from './components/Scene';
import CreatorPanel from './components/CreatorPanel';
import { useCreator } from './store';

export default function App() {
  const name = useCreator((s) => s.name);
  const animation = useCreator((s) => s.animation);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--paper)]">
      <Scene />

      {/* Name badge */}
      <div className="absolute bottom-6 left-5 sm:left-6 pointer-events-none">
        <div className="paper-card px-5 py-2.5">
          <div className="font-display text-[var(--ink)] font-extrabold tracking-[0.2em] text-base uppercase">
            {name || 'UNNAMED'}
          </div>
          <div className="text-[var(--ink)]/50 text-[10px] uppercase tracking-[0.2em] font-bold">
            now playing — <span style={{ color: 'var(--red)' }}>{animation}</span>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute top-4 left-4 pointer-events-none hidden sm:block">
        <div className="bg-[var(--paper)] border border-[var(--ink)] px-3 py-2 text-[var(--ink)]/70 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_var(--ink)]">
          Drag to orbit · Scroll to zoom
        </div>
      </div>

      <CreatorPanel />
    </div>
  );
}
