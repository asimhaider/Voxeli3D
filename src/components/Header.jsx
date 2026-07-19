import { useEffect, useState } from 'react';
import LogoMark from './icons/LogoMark';

/** Edit NAV_LINKS to add, remove, or rename navigation items. */
const NAV_LINKS = [
  { label: 'Capabilities', href: '#verticals' },
  { label: 'Catalogue', href: '#catalogue' },
  { label: 'Process', href: '#process' },
  { label: 'Custom order', href: '#custom-upload' },
  { label: 'Work', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="header__brand">
          <LogoMark size={30} />
          <span className="header__name">Voxelis <span className="header__name-accent">3D</span></span>
        </a>

        <nav className="header__nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="header__link">{link.label}</a>
          ))}
        </nav>

        <a href="#contact" className="btn btn--primary header__cta">Get a quote</a>

        <button
          className="header__burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="header__mobile-menu">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={() => setMenuOpen(false)}>Get a quote</a>
        </div>
      )}

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        .header--scrolled { border-bottom-color: var(--color-line); }
        .header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          padding-bottom: 16px;
        }
        .header__brand { display: flex; align-items: center; gap: 10px; }
        .header__name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
        }
        .header__name-accent { color: var(--color-yellow-dim); }
        .header__nav { display: flex; gap: 32px; }
        .header__link {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-black);
          opacity: 0.75;
          transition: opacity 0.15s ease;
        }
        .header__link:hover { opacity: 1; }
        .header__cta { padding: 10px 20px; }
        .header__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 8px;
        }
        .header__burger span {
          width: 22px;
          height: 2px;
          background: var(--color-black);
        }
        .header__mobile-menu {
          display: none;
        }
        @media (max-width: 860px) {
          .header__nav, .header__cta { display: none; }
          .header__burger { display: flex; }
          .header__mobile-menu {
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 20px clamp(20px, 5vw, 48px) 28px;
            border-top: 1px solid var(--color-line);
          }
          .header__mobile-menu a:not(.btn) { font-size: 15px; font-weight: 500; }
          .header__mobile-menu .btn { align-self: flex-start; }
        }
      `}</style>
    </header>
  );
}
