import { useEffect, useMemo, useState } from 'react';
import CatalogueCard from './CatalogueCard';
import { API_URL } from '../config';

/**
 * Edit this array to add, remove, or update catalogue items.
 * Each item can use a product photo or an SVG fallback shape.
 */
const DEFAULT_CATALOGUE = [
    {
        category: 'Trending',
        title: 'Spidey and Dino',
        description: 'Expertly crafted articulated spider and dinosaur skeleton prints that combine precision, creativity, and durability.',
        material: 'PLA (multi-color)',
        size: '12–18 cm',
        priceRange: '₹299',
        turnaround: '2–3 days',
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
        size: '16 cm',
        priceRange: '₹249',
        turnaround: '2–3 days',
        image: '/images/warrior-incence-holder.png'
    },
    {
        category: 'Trending',
        title: 'Incense Stick Holder - Samurai Edition',
        description: 'An elegantly designed samurai incense holder that blends traditional craftsmanship with modern décor, perfect for creating a calm and stylish atmosphere.',
        material: 'PLA+',
        size: '14 cm',
        priceRange: '₹199',
        turnaround: '2–3 days',
        image: '/images/samurai-incence-stick.png'
    },
    {
        category: 'Trending',
        title: 'Wardrobe Hanger',
        description: 'A durable and space-saving wardrobe hanger designed to keep your clothes organized, wrinkle-free, and easily accessible.',
        material: 'PLA+',
        size: '20 cm',
        priceRange: '₹99',
        turnaround: '1–2 days',
        image: '/images/wardrobe-hanger.png'
    },
    {
        category: 'Trending',
        title: 'Incense Stick Holder - Moai Edition',
        description: 'A uniquely crafted Moai-inspired incense holder that brings a minimalist, artistic charm while neatly catching incense ash.',
        material: 'PLA+',
        size: '13 cm',
        priceRange: '₹199',
        turnaround: '2–3 days',
        image: '/images/maoi-incence-holder.png'
    },
    {
        category: 'Trending',
        title: 'Leaf Bowl',
        description: 'A beautifully crafted leaf-shaped bowl that combines natural elegance with everyday functionality, perfect for décor, jewelry, or small essentials.',
        material: 'PLA+',
        size: '18 cm',
        priceRange: '₹249',
        turnaround: '2–3 days',
        image: '/images/leaf-bowl.png'
    },
    {
        category: 'Trending',
        title: 'Bowl - Coins and Keys',
        description: 'A stylish and practical catch-all bowl designed to keep your coins, keys, and everyday essentials neatly organized in one place.',
        material: 'PLA+',
        size: '14 cm',
        priceRange: '₹199',
        turnaround: '2–3 days',
        image: '/images/coin-keys-bowl.png'
    },
    {
        category: 'Trending',
        title: 'Remote Organiser',
        description: 'A sleek and practical remote organiser designed to keep your TV remotes, gadgets, and everyday essentials neatly arranged and within easy reach.',
        material: 'PLA+',
        size: '22 cm',
        priceRange: '₹349',
        turnaround: '2–3 days',
        image: '/images/remote-organiser.png'
    },
    {
        category: 'Trending',
        title: 'Spoon-Fork-Glasses Organiser',
        description: 'A versatile organizer designed to neatly store spoons, forks, glasses, and other kitchen essentials while keeping your countertop clutter-free.',
        material: 'PLA+',
        size: '18 cm',
        priceRange: '₹249',
        turnaround: '2–3 days',
        image: '/images/spoon-fork-organiser.png'
    },
];

export default function CatalogueSection({ onRequestProduct }) {
    const [catalogue, setCatalogue] = useState(DEFAULT_CATALOGUE);
    const [activeCategory, setActiveCategory] = useState(DEFAULT_CATALOGUE[0].category);
    const categories = useMemo(() => [...new Set(catalogue.map((item) => item.category))], [catalogue]);

    useEffect(() => {
        let ignore = false;
        fetch(`${API_URL}/api/catalogue`)
            .then(async (response) => {
                if (!response.ok) throw new Error('Catalogue could not be loaded');
                return response.json();
            })
            .then((items) => {
                if (!ignore && Array.isArray(items)) setCatalogue(items);
            })
            .catch(() => {
                // Keep the built-in catalogue visible while Supabase is being configured.
            });
        return () => { ignore = true; };
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !categories.includes(activeCategory)) {
            setActiveCategory(categories[0]);
        }
    }, [activeCategory, categories]);

    const filtered = useMemo(
        () => catalogue.filter((item) => item.category === activeCategory),
        [activeCategory, catalogue]
    );

    const handleRequest = (product) => {
        onRequestProduct?.(product);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section id="catalogue" className="catalogue">
            <div className="container">
                <div className="catalogue__head">
                    <div>
                        <p className="eyebrow">Our catalogue</p>
                        <h2 className="catalogue__title">Popular prints, ready to customize</h2>
                        <p className="catalogue__sub">Starting prices, approximate sizes, material, and typical turnaround are shown. Every piece can be resized, recolored, or modified.</p>
                    </div>
                </div>

                <div className="catalogue__tabs" role="tablist">
                    {categories.map((cat) => (
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
                        <CatalogueCard key={item.id || item.title} {...item} image={item.imageUrl || item.image} priceRange={item.price || item.priceRange} onRequest={handleRequest} />
                    ))}
                    {filtered.length === 0 && <p className="catalogue__empty">New catalogue products are being added. Contact us for a custom print.</p>}
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
        .catalogue__empty { grid-column: 1 / -1; color: var(--color-grey); font-size: 14px; }
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
