import { useState } from 'react';
import {
  useCreator,
  SKIN_TONES,
  HAIR_COLORS,
  OUTFIT_COLORS,
  type HairStyle,
  type Accessory,
  type AnimationId,
} from '../store';

const HAIR_LABELS: Record<HairStyle, string> = {
  none: 'Bald', flat: 'Flat', spiky: 'Spiky', mohawk: 'Mohawk', bun: 'Bun', twin: 'Twintails',
};
const ACC_LABELS: Record<Accessory, string> = {
  none: 'None', cap: 'Cap', glasses: 'Glasses', horns: 'Horns', crown: 'Crown',
};
const ANIM_LABELS: Record<AnimationId, string> = {
  idle: 'Idle', wave: 'Wave', walk: 'Walk', jump: 'Jump', spin: 'Spin', dance: 'Dance',
};

/* RGB triad cycles across control groups */
const TRIAD = ['var(--red)', 'var(--blue)', 'var(--mint)'];

function SectionLabel({ n, label, accent }: { n: string; label: string; accent: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-1.5">
      <span className="font-display text-[10px]" style={{ color: accent }}>{n}</span>
      <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--ink)]/60">{label}</span>
    </div>
  );
}

function SwatchRow({
  n, label, colors, value, onPick, accent,
}: { n: string; label: string; colors: string[]; value: string; onPick: (c: string) => void; accent: string }) {
  return (
    <div>
      <SectionLabel n={n} label={label} accent={accent} />
      <div className="flex flex-wrap gap-1.5">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onPick(c)}
            className={`w-7 h-7 border transition-transform duration-150 hover:-translate-y-0.5 ${
              value === c ? 'border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] -translate-y-0.5' : 'border-[var(--ink)]/40'
            }`}
            style={{ backgroundColor: c }}
            aria-label={`${label} ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChipRow<T extends string>({
  n, label, options, labels, value, onPick, accent,
}: { n: string; label: string; options: T[]; labels: Record<T, string>; value: T; onPick: (v: T) => void; accent: string }) {
  return (
    <div>
      <SectionLabel n={n} label={label} accent={accent} />
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onPick(o)}
              className={`px-3 py-1.5 border border-[var(--ink)] text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                active
                  ? 'text-white shadow-[2px_2px_0_var(--ink)] -translate-y-0.5'
                  : 'bg-white text-[var(--ink)] hover:-translate-y-0.5 hover:shadow-[2px_2px_0_var(--ink)]'
              }`}
              style={active ? { backgroundColor: accent } : undefined}
            >
              {labels[o]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.2" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="15.8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="15.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <path d="M14.5 4a4.5 4.5 0 0 0-4.3 5.7L4 15.9V20h4.1l6.2-6.2A4.5 4.5 0 0 0 20 9.5l-2.8 2.8-2.5-.7-.7-2.5L16.8 6.3 14.5 4z" />
    </svg>
  );
}

export default function CreatorPanel() {
  const s = useCreator();
  const [open, setOpen] = useState(false);

  let gi = 0;
  const nextAccent = () => TRIAD[gi++ % TRIAD.length];

  const controls = (
    <>
      <input
        value={s.name}
        onChange={(e) => s.set({ name: e.target.value.toUpperCase().slice(0, 12) })}
        className="w-full bg-white border border-[var(--ink)] px-3 py-2 font-display text-sm font-semibold tracking-[0.2em] text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/30 focus:shadow-[3px_3px_0_var(--ink)] transition-shadow"
        placeholder="CHARACTER NAME"
      />

      <SwatchRow n="01" label="Skin" colors={SKIN_TONES} value={s.skin} onPick={(c) => s.set({ skin: c })} accent={nextAccent()} />
      <SwatchRow n="02" label="Hair color" colors={HAIR_COLORS} value={s.hairColor} onPick={(c) => s.set({ hairColor: c })} accent={nextAccent()} />
      <ChipRow
        n="03"
        label="Hair style"
        options={['none', 'flat', 'spiky', 'mohawk', 'bun', 'twin'] as HairStyle[]}
        labels={HAIR_LABELS}
        value={s.hairStyle}
        onPick={(v) => s.set({ hairStyle: v })}
        accent={nextAccent()}
      />
      <SwatchRow n="04" label="Shirt" colors={OUTFIT_COLORS} value={s.shirt} onPick={(c) => s.set({ shirt: c })} accent={nextAccent()} />
      <SwatchRow n="05" label="Pants" colors={OUTFIT_COLORS} value={s.pants} onPick={(c) => s.set({ pants: c })} accent={nextAccent()} />
      <SwatchRow n="06" label="Shoes" colors={OUTFIT_COLORS} value={s.shoes} onPick={(c) => s.set({ shoes: c })} accent={nextAccent()} />
      <ChipRow
        n="07"
        label="Accessory"
        options={['none', 'cap', 'glasses', 'horns', 'crown'] as Accessory[]}
        labels={ACC_LABELS}
        value={s.accessory}
        onPick={(v) => s.set({ accessory: v })}
        accent={nextAccent()}
      />
      <ChipRow
        n="08"
        label="Animation"
        options={['idle', 'wave', 'walk', 'jump', 'spin', 'dance'] as AnimationId[]}
        labels={ANIM_LABELS}
        value={s.animation}
        onPick={(v) => s.set({ animation: v })}
        accent={nextAccent()}
      />

      <div className="pt-3 pb-2 pr-2">
        <button
          onClick={s.randomize}
          className="btn-stack w-full bg-[var(--paper)] border border-[var(--ink)] py-3 px-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink)] flex items-center justify-center gap-2.5"
        >
          <DiceIcon />
          Randomize
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop side panel */}
      <div className="hidden sm:block absolute top-0 right-0 h-full w-[340px] pointer-events-none p-5">
        <div className="pointer-events-auto w-full h-full overflow-y-auto scrollbar-thin paper-card p-5 space-y-4">
          <div>
            <h1 className="font-display text-base font-extrabold text-[var(--ink)] tracking-tight uppercase leading-tight">
              Low Poly<br />
              <span className="text-stroke">Forge</span>
            </h1>
            <p className="text-xs text-[var(--ink)]/50 mt-1">Character creator for web games</p>
          </div>
          {controls}
        </div>
      </div>

      {/* Mobile: compact title */}
      <div className="sm:hidden absolute top-0 left-0 right-0 pointer-events-none flex justify-center pt-4">
        <h1 className="font-display text-sm font-extrabold text-[var(--ink)] uppercase tracking-[0.25em]">
          Low Poly <span className="text-stroke">Forge</span>
        </h1>
      </div>

      {/* Mobile: FAB */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden absolute bottom-5 right-5 w-14 h-14 bg-[var(--red)] border border-[var(--ink)] text-[var(--paper)] shadow-[4px_4px_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--ink)] transition-all flex items-center justify-center"
        aria-label="Open character editor"
      >
        <WrenchIcon />
      </button>

      {/* Mobile: bottom sheet */}
      <div className={`sm:hidden fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-[var(--ink)]/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[75vh] border-t border-[var(--ink)] bg-[var(--paper)] p-5 pb-8 space-y-4 overflow-y-auto scrollbar-thin transition-transform duration-300 ease-[var(--ease-out)] ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button onClick={() => setOpen(false)} className="w-full flex justify-center pb-1" aria-label="Close editor">
            <div className="w-12 h-1.5 bg-[var(--ink)]" />
          </button>
          {controls}
        </div>
      </div>
    </>
  );
}
