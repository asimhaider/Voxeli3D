import VerticalCard from './VerticalCard';
import { StemIcon, IndustrialIcon, PrototypeIcon, DevotionalIcon } from './icons/VerticalIcons';

/** Add, remove, or edit verticals here — the grid adapts automatically. */
const VERTICALS = [
  {
    icon: <StemIcon />,
    tag: 'EDU',
    title: 'STEM education kits',
    description: 'Hands-on model sets and lab aids for schools and edtech partners — durable, curriculum-aligned, and shipped ready to teach with.',
  },
  {
    icon: <IndustrialIcon />,
    tag: 'MFG',
    title: 'Industrial spare parts',
    description: 'On-demand production of discontinued or slow-moving components, cutting downtime for factories and equipment operators.',
  },
  {
    icon: <PrototypeIcon />,
    tag: 'R&D',
    title: 'Rapid prototyping',
    description: 'Concept-to-part turnaround in days, not weeks — for founders, design studios, and engineering teams validating a build.',
  },
  {
    icon: <DevotionalIcon />,
    tag: 'CUSTOM',
    title: 'Personalized devotional pieces',
    description: 'Custom-modeled religious and ceremonial objects, finished by hand for gifting, home shrines, and community orders.',
  },
];

export default function VerticalsSection() {
  return (
    <section id="verticals" className="verticals">
      <div className="container">
        <div className="verticals__head">
          <p className="eyebrow">What we manufacture</p>
          <h2 className="verticals__title">Four verticals. One print farm.</h2>
        </div>

        <div className="verticals__grid">
          {VERTICALS.map((v) => (
            <VerticalCard key={v.title} {...v} />
          ))}
        </div>
      </div>

      <style>{`
        .verticals {
          padding: var(--section-pad) 0;
        }
        .verticals__head {
          max-width: 560px;
          margin-bottom: 48px;
        }
        .verticals__title {
          margin-top: 14px;
          font-size: clamp(28px, 3.6vw, 40px);
          font-weight: 600;
        }
        .verticals__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1000px) {
          .verticals__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .verticals__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
