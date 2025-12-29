import React, { useState } from 'react';

const banners = [
  {
    bg: "bg-[url('https://images.unsplash.com/photo-1515165562835-cf7747d3b6e7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center",
    gradient: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 opacity-80",
    title: '⚡ FLASH SALE!',
    subtitle: 'Biggest Discounts of the Year',
    offers: [
      '🔥 Only 50% Off on All Products',
    ],
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    badge: 'Limited Time Offer!',
    badgeColor: 'text-pink-600',
    btnColor: 'text-pink-600',
  },
  {
    bg: "bg-[url('https://images.unsplash.com/photo-1515165562835-cf7747d3b6e7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center",
    gradient: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 opacity-80",
    title: '📱 Mobile Accessories',
    subtitle: 'Best deals on latest gadgets',
    offers: ['Upto 60% Off on Earphones, Chargers & More'],
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    badge: 'Hot Gadgets!',
    badgeColor: 'text-pink-600',
    btnColor: 'text-pink-600',
  },
  {
    bg: "bg-[url('https://images.unsplash.com/photo-1515165562835-cf7747d3b6e7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center",
    gradient: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 opacity-80",
    title: '🧥 Winter Fashion',
    subtitle: 'Stay warm with trendy winter wear',
    offers: ['Flat 40% Off on Jackets & Sweaters'],
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    badge: 'Winter Collection!',
    badgeColor: 'text-pink-600',
    btnColor: 'text-pink-600',
  },
  {
    bg: "bg-[url('https://images.unsplash.com/photo-1515165562835-cf7747d3b6e7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center",
    gradient: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 opacity-80",
    title: '🏠 Home Decoration',
    subtitle: 'Make your home beautiful',
    offers: ['Flat 50% Off on Decor Items'],
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80',
    badge: 'Decor Sale!',
    badgeColor: 'text-pink-600',
    btnColor: 'text-pink-600',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const nextBanner = () => setCurrent((current + 1) % banners.length);
  const prevBanner = () => setCurrent((current - 1 + banners.length) % banners.length);
  const banner = banners[current];

  // Auto swipe every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${banner.bg} flex flex-col md:flex-row items-center justify-between p-0 mb-10`} style={{ minHeight: '340px', height: '340px', maxHeight: '340px', animation: 'fadeIn 0.8s' }}>
      {/* Fireworks animation removed as requested */}
      {banner.gradient && <div className={`absolute inset-0 ${banner.gradient} animate-gradient-move`}></div>}
      <div className="flex-1 relative z-10 text-white flex flex-col justify-center items-start px-10 py-8">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">{banner.title}</h2>
        <p className="text-xl md:text-2xl font-bold mb-2 animate-fade-in-delay">{banner.subtitle}</p>
        <ul className="space-y-2 text-md md:text-lg font-semibold animate-fade-in-delay">
          {banner.offers.map((offer, i) => <li key={i}>{offer}</li>)}
        </ul>
        <button className={`mt-6 px-8 py-3 bg-white ${banner.btnColor} font-bold text-lg rounded-2xl shadow-lg hover:bg-opacity-80 transition animate-fade-in-delay animate-shopnow`}>Shop Now</button>
      </div>
      <div className="flex-1 flex justify-center items-center relative z-10 h-full">
        <img
          key={current}
          src={banner.img}
          alt={banner.title}
          className="w-64 h-64 object-cover rounded-2xl shadow-xl border-4 border-white animate-img-pop"
        />
      </div>

      {/* Badge button removed as requested */}
      {/* Dots below banners, synced with swipe */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, i) => (
          <span key={i} className={`w-3 h-3 rounded-full border border-white ${i === current ? 'bg-white' : 'bg-gray-400'} inline-block animate-dot transition-all duration-300`}></span>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes imgPop { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @keyframes fadeInDelay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes arrow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shopnowBounceGlow {
          0% { transform: scale(1); box-shadow: 0 0 0px #fff700; }
          20% { transform: scale(1.08); box-shadow: 0 0 16px #fff700; }
          40% { transform: scale(0.98); box-shadow: 0 0 8px #ff0077; }
          60% { transform: scale(1.05); box-shadow: 0 0 20px #00eaff; }
          80% { transform: scale(1.02); box-shadow: 0 0 12px #ff00cc; }
          100% { transform: scale(1); box-shadow: 0 0 0px #fff700; }
        }
        .animate-fade-in { animation: fadeIn 0.8s; }
        .animate-fade-in-delay { animation: fadeInDelay 1.2s; }
        .animate-img-pop { animation: imgPop 1.2s; }
        .animate-gradient-move { animation: gradientMove 3s infinite alternate; }
        .animate-arrow { animation: arrow 1.2s infinite; }
        .animate-dot { animation: dot 1.5s infinite; }
        .animate-shopnow { animation: shopnowBounceGlow 1.8s infinite; }
      `}</style>
    </div>
  );
}
