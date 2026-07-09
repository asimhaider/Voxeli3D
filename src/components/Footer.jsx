import LogoMark from './icons/LogoMark';

const FOOTER_LINKS = {
  Company: ['About', 'Careers', 'Contact'],
  Capabilities: ['STEM education', 'Industrial parts', 'Prototyping', 'Devotional pieces'],
  Resources: ['Materials guide', 'FAQs', 'Get a quote'],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-row">
            <LogoMark size={26} dark />
            <span>Voxelis 3D</span>
          </div>
          <p className="footer__addr">Lucknow, Uttar Pradesh, India</p>
        </div>

        <div className="footer__cols">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="footer__col">
              <h4>{heading}</h4>
              <ul>
                {links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <span>&copy; {new Date().getFullYear()} Voxelis 3D Solutions. All rights reserved.</span>
      </div>

      <style>{`
        .footer {
          background: var(--color-black);
          color: var(--color-white);
          padding: 64px 0 0;
        }
        .footer__inner {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          flex-wrap: wrap;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--color-line-on-dark);
        }
        .footer__brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 17px;
        }
        .footer__addr {
          margin-top: 12px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.5);
        }
        .footer__cols {
          display: flex;
          gap: 56px;
          flex-wrap: wrap;
        }
        .footer__col h4 {
          font-size: 13px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-yellow);
          margin-bottom: 16px;
        }
        .footer__col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer__col a {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }
        .footer__col a:hover { color: var(--color-white); }
        .footer__bottom {
          padding: 22px 0;
          font-size: 12.5px;
          color: rgba(255,255,255,0.4);
        }
      `}</style>
    </footer>
  );
}
