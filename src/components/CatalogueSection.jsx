import { useState, useMemo } from 'react';
import CatalogueCard from './CatalogueCard';

/**
 * Edit this array to add, remove, or update catalogue items.
 * Each item can use a product photo or an SVG fallback shape.
 */
const CATALOGUE = [
    {
        category: 'Trending',
        title: 'Spidey and Dino',
        description: 'Expertly crafted articulated spider and dinosaur skeleton prints that combine precision, creativity, and durability.',
        material: 'PLA (multi-color)',
        priceRange: '₹299',
        image: '/images/spider.jpeg',
    },
    // {
    //     category: 'Trending',
    //     title: 'Mystic Dragon – Breathtaking Dragon Figure',
    //     description: 'An intricately designed articulated dragon, perfect for collectors and fantasy enthusiasts.',
    //     material: 'PLA+',
    //     priceRange: '₹450',
    //     image: '/images/dragon.png'
    // },
    {
        category: 'Trending',
        title: 'Incense Stick Holder - Warrior Edition',
        description: 'An intricately crafted warrior incense holder that adds a bold, artistic touch to your space while elegantly catching ash.',
        material: 'PLA+',
        priceRange: '₹249',
        image: '/images/warrior-incence-holder.png'
    },
    {
        category: 'Trending',
        title: 'Incense Stick Holder - Samurai Edition',
        description: 'An elegantly designed samurai incense holder that blends traditional craftsmanship with modern décor, perfect for creating a calm and stylish atmosphere.',
        material: 'PLA+',
        priceRange: '₹199',
        image: '/images/samurai-incence-stick.png'
    },
    {
        category: 'Trending',
        title: 'Wardrobe Hanger',
        description: 'A durable and space-saving wardrobe hanger designed to keep your clothes organized, wrinkle-free, and easily accessible.',
        material: 'PLA+',
        priceRange: '₹99',
        image: '/images/wardrobe-hanger.png'
    },
    {
        category: 'Trending',
        title: 'Incense Stick Holder - Moai Edition',
        description: 'A uniquely crafted Moai-inspired incense holder that brings a minimalist, artistic charm while neatly catching incense ash.',
        material: 'PLA+',
        priceRange: '₹199',
        image: '/images/maoi-incence-holder.png'
    },
    {
        category: 'Trending',
        title: 'Leaf Bowl',
        description: 'A beautifully crafted leaf-shaped bowl that combines natural elegance with everyday functionality, perfect for décor, jewelry, or small essentials.',
        material: 'PLA+',
        priceRange: '₹249',
        image: '/images/leaf-bowl.png'
    },
    {
        category: 'Trending',
        title: 'Bowl - Coins and Keys',
        description: 'A stylish and practical catch-all bowl designed to keep your coins, keys, and everyday essentials neatly organized in one place.',
        material: 'PLA+',
        priceRange: '₹199',
        image: '/images/coin-keys-bowl.png'
    },
    {
        category: 'Trending',
        title: 'Remote Organiser',
        description: 'A sleek and practical remote organiser designed to keep your TV remotes, gadgets, and everyday essentials neatly arranged and within easy reach.',
        material: 'PLA+',
        priceRange: '₹349',
        image: '/images/remote-organiser.png'
    },
    {
        category: 'Trending',
        title: 'Spoon-Fork-Glasses Organiser',
        description: 'A versatile organizer designed to neatly store spoons, forks, glasses, and other kitchen essentials while keeping your countertop clutter-free.',
        material: 'PLA+',
        priceRange: '₹249',
        image: '/images/spoon-fork-organiser.png'
    },
];

const CATEGORIES = [...new Set(CATALOGUE.map((item) => item.category))];

export default function CatalogueSection() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    const filtered = useMemo(
        () => CATALOGUE.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    return (
        <section id="catalogue" className="catalogue">
            <div className="container">
                <div className="catalogue__head">
                    <div>
                        <p className="eyebrow">Our catalogue</p>
                        <h2 className="catalogue__title">Popular prints, ready to customize</h2>
                        <p className="catalogue__sub">Starting prices shown — every piece can be resized, recolored, or modified. Don't see what you want? Upload a photo and we'll model it from scratch.</p>
                    </div>
                </div>

                <div className="catalogue__tabs" role="tablist">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={activeCategory === cat}
                            className={`catalogue__tab ${activeCategory === cat ? 'catalogue__tab--active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="catalogue__grid">
                    {filtered.map((item) => (
                        <CatalogueCard key={item.title} {...item} />
                    ))}
                </div>
            </div>

            <style>{`
        .catalogue { padding: var(--section-pad) 0; }
        .catalogue__head { max-width: 620px; margin-bottom: 32px; }
        .catalogue__title {
          margin-top: 14px;
          font-size: clamp(28px, 3.6vw, 40px);
          font-weight: 600;
        }
        .catalogue__sub {
          margin-top: 14px;
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-grey);
        }
        .catalogue__tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .catalogue__tab {
          padding: 9px 18px;
          border-radius: 20px;
          border: 1.5px solid var(--color-line);
          background: var(--color-white);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-grey);
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .catalogue__tab:hover { border-color: var(--color-black); color: var(--color-black); }
        .catalogue__tab--active {
          background: var(--color-black);
          border-color: var(--color-black);
          color: var(--color-white);
        }
        .catalogue__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1000px) {
          .catalogue__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .catalogue__grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </section>
    );
}
