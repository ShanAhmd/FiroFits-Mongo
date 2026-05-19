import React, { useState, useEffect } from 'react';
import { type Package, type Product, type Measurements } from '../types';
import { getProducts } from '../services/supabaseClient';

interface PackageDetailPageProps {
  pkg: Package;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, customMeasurements?: Measurements) => void;
}

const getPrimaryImage = (imageUrlString: string): string => {
  if (!imageUrlString) return '';
  if (imageUrlString.startsWith('[')) {
    try { const arr = JSON.parse(imageUrlString); if (Array.isArray(arr)) return arr[0] || ''; } catch {}
  }
  return imageUrlString;
};

const PackageDetailPage: React.FC<PackageDetailPageProps> = ({ pkg, onBack, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    getProducts().then(all => {
      const inPkg = all.filter(p => pkg.items.some(i => i.productId === p.id));
      setProducts(inPkg);
    });
  }, [pkg]);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(pkg.validTo).getTime() - Date.now();
      setDaysLeft(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
      setHoursLeft(Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [pkg.validTo]);

  const totalOriginal = products.reduce((acc, p) => {
    const qi = pkg.items.find(i => i.productId === p.id);
    return acc + p.price * (qi?.qty || 1);
  }, 0);

  const discount = pkg.discountPercent
    ? Math.round(totalOriginal * pkg.discountPercent / 100)
    : (pkg.discountFlat || 0);
  const finalPrice = Math.max(0, totalOriginal - discount);

  const handleAddAll = () => {
    products.forEach(p => onAddToCart(p, 'M'));
  };

  const typeColors: Record<string, string> = {
    'Seasonal': 'from-orange-500 to-amber-400',
    'Festival': 'from-purple-600 to-pink-500',
    'Special Offer': 'from-emerald-600 to-teal-400',
    'Bundle': 'from-blue-600 to-indigo-500',
  };
  const gradientClass = typeColors[pkg.type] || 'from-slate-800 to-slate-600';

  return (
    <div className="animate-fade-in font-sans">
      {/* Hero Banner */}
      <div className={`relative w-full min-h-[340px] bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {pkg.bannerImageUrl && (
          <img src={pkg.bannerImageUrl} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"/>
        )}
        <div className="absolute inset-0 bg-black/30"/>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 h-full">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back to Shop
            </button>
            {pkg.badgeLabel && (
              <span className="inline-block bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 border border-white/30">{pkg.badgeLabel}</span>
            )}
            <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em] mb-2">{pkg.tag}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">{pkg.name}</h1>
            <p className="text-white/80 mt-3 text-sm max-w-lg leading-relaxed">{pkg.description}</p>
          </div>
          {/* Countdown + CTA */}
          <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 text-center text-white">
              <p className="text-[10px] uppercase tracking-widest font-black opacity-70 mb-2">Offer Ends In</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-black">{daysLeft}</span>
                <span className="text-sm opacity-70">days</span>
                <span className="text-2xl font-mono font-black">{hoursLeft}</span>
                <span className="text-sm opacity-70">hrs</span>
              </div>
            </div>
            {products.length > 0 && (
              <div className="text-right">
                <p className="text-white/50 text-xs line-through">Rs. {totalOriginal.toLocaleString()}</p>
                <p className="text-white text-2xl font-black font-mono">Rs. {finalPrice.toLocaleString()}</p>
                {pkg.discountPercent && <p className="text-white/70 text-xs mt-0.5">{pkg.discountPercent}% discount applied</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products in Package */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 uppercase tracking-tight">Package Contents</h2>
            <p className="text-slate-500 text-sm mt-1">{products.length} items included in this deal</p>
          </div>
          {products.length > 0 && (
            <button onClick={handleAddAll} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg">
              Add All to Cart — Rs. {finalPrice.toLocaleString()}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(prod => {
            const pkgItem = pkg.items.find(i => i.productId === prod.id);
            return (
              <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {getPrimaryImage(prod.imageUrl) ? (
                    <img src={getPrimaryImage(prod.imageUrl)} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300">👗</div>
                  )}
                  {pkg.discountPercent && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-full">{pkg.discountPercent}% OFF</div>
                  )}
                  {pkgItem && pkgItem.qty > 1 && (
                    <div className="absolute top-2 right-2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-full">×{pkgItem.qty}</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{prod.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <p className="font-black font-mono text-slate-900 text-sm">
                      Rs. {pkg.discountPercent ? Math.round(prod.price * (1 - pkg.discountPercent / 100)).toLocaleString() : prod.price.toLocaleString()}
                    </p>
                    {pkg.discountPercent && <p className="text-xs text-slate-400 line-through font-mono">Rs. {prod.price.toLocaleString()}</p>}
                  </div>
                  <button onClick={() => onAddToCart(prod, 'M')} className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
