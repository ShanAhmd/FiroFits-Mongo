import React, { useState, useEffect } from 'react';
import { type Product, type Package, type Measurements, ProductCategory } from '../types';
import { getProducts, getActivePackages } from '../services/supabaseClient';
import PackageDetailPage from './PackageDetailPage';

interface CustomProductsPageProps {
  onAddToCart: (product: Product, size: string, customMeasurements?: Measurements) => void;
  onOrderBespoke: (product: Product) => void;
}

const getAllImages = (s: string): string[] => {
  if (!s) return [];
  if (s.startsWith('[')) { try { const a = JSON.parse(s); if (Array.isArray(a)) return a; } catch {} }
  return [s];
};
const getPrimaryImage = (s: string) => getAllImages(s)[0] || '';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under Rs. 5,000', value: 'under-5' },
  { label: 'Rs. 5,000 – 10,000', value: '5-10' },
  { label: 'Rs. 10,000 – 20,000', value: '10-20' },
  { label: 'Above Rs. 20,000', value: 'over-20' },
];

const CustomProductsPage: React.FC<CustomProductsPageProps> = ({ onAddToCart, onOrderBespoke }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'packages'>('products');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [subCategory, setSubCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onOfferOnly, setOnOfferOnly] = useState(false);

  // Drawer
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isBespokeSize, setIsBespokeSize] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>({
    shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '',
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [prods, pkgs] = await Promise.all([getProducts(), getActivePackages()]);
      setProducts(prods);
      setPackages(pkgs);
      setIsLoading(false);
    })();
  }, []);

  // Products in any active package
  const packageProductIds = new Set(packages.flatMap(p => p.items.map(i => i.productId)));

  // Derived subcategories from filtered gender
  const subCategories = React.useMemo(() => {
    const filtered = genderFilter === 'All' ? products : products.filter(p => p.productCategory === genderFilter || p.category === genderFilter);
    return ['All', ...Array.from(new Set(filtered.map(p => p.subCategory).filter(Boolean) as string[]))];
  }, [products, genderFilter]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGender = genderFilter === 'All' || p.productCategory === genderFilter || p.category === genderFilter;
      const matchSub = subCategory === 'All' || p.subCategory === subCategory;
      const matchStock = !inStockOnly || (p.stock !== undefined && p.stock > 0);
      const matchOffer = !onOfferOnly || packageProductIds.has(p.id);
      let matchPrice = true;
      if (priceRange === 'under-5') matchPrice = p.price < 5000;
      else if (priceRange === '5-10') matchPrice = p.price >= 5000 && p.price <= 10000;
      else if (priceRange === '10-20') matchPrice = p.price > 10000 && p.price <= 20000;
      else if (priceRange === 'over-20') matchPrice = p.price > 20000;
      return matchSearch && matchGender && matchSub && matchStock && matchOffer && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, searchTerm, genderFilter, subCategory, inStockOnly, onOfferOnly, priceRange, sortBy, packageProductIds]);

  const openDrawer = (product: Product) => {
    setDrawerProduct(product);
    setActiveImageIndex(0);
    setSelectedSize('M');
    setIsBespokeSize(false);
    setMeasurements({ shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '' });
  };

  const handleAddToCartSubmit = () => {
    if (!drawerProduct) return;
    onAddToCart(drawerProduct, isBespokeSize ? 'Bespoke Custom' : selectedSize, isBespokeSize ? measurements : undefined);
    setDrawerProduct(null);
  };

  if (selectedPackage) {
    return <PackageDetailPage pkg={selectedPackage} onBack={() => setSelectedPackage(null)} onAddToCart={onAddToCart} />;
  }

  return (
    <div className="animate-fade-in font-sans pb-32 pt-20">

      {/* Page Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="border-b border-slate-200 pb-8 mb-8">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase leading-none text-slate-900">Shop Collection.</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500 mt-4">Browse ready-to-wear designs, premium packages, and seasonal deals.</p>
        </div>

        {/* Tabs: Products | Packages */}
        <div className="flex gap-1 mb-8 bg-slate-100 rounded-xl p-1 w-fit">
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Products ({products.length})
          </button>
          <button onClick={() => setActiveTab('packages')} className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'packages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            🎁 Packages
            {packages.length > 0 && <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{packages.length}</span>}
          </button>
        </div>

        {/* ======= PACKAGES TAB ======= */}
        {activeTab === 'packages' && (
          <div>
            {packages.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="text-5xl mb-4">🎁</div>
                <p className="text-slate-500 font-semibold">No active packages right now</p>
                <p className="text-slate-400 text-sm mt-1">Check back soon for seasonal deals and festival offers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map(pkg => {
                  const today = new Date().toISOString().split('T')[0];
                  const daysLeft = Math.max(0, Math.ceil((new Date(pkg.validTo).getTime() - Date.now()) / 86400000));
                  const typeGradients: Record<string, string> = {
                    'Seasonal': 'from-orange-500 to-amber-400',
                    'Festival': 'from-purple-600 to-pink-500',
                    'Special Offer': 'from-emerald-600 to-teal-400',
                    'Bundle': 'from-blue-600 to-indigo-500',
                  };
                  const grad = typeGradients[pkg.type] || 'from-slate-700 to-slate-500';
                  return (
                    <div key={pkg.id} onClick={() => setSelectedPackage(pkg)}
                      className="cursor-pointer group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className={`h-48 bg-gradient-to-br ${grad} relative`}>
                        {pkg.bannerImageUrl && <img src={pkg.bannerImageUrl} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"/>}
                        <div className="absolute inset-0 bg-black/20"/>
                        <div className="absolute top-4 left-4">
                          {pkg.badgeLabel && <span className="bg-white/20 backdrop-blur text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/30">{pkg.badgeLabel}</span>}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em]">{pkg.tag}</p>
                          <h3 className="text-white font-serif text-2xl font-bold leading-tight">{pkg.name}</h3>
                        </div>
                      </div>
                      <div className="bg-white p-5 flex items-center justify-between">
                        <div>
                          {pkg.discountPercent && <p className="text-emerald-700 font-black text-lg">{pkg.discountPercent}% OFF</p>}
                          {pkg.discountFlat && <p className="text-emerald-700 font-black text-lg">Rs. {pkg.discountFlat.toLocaleString()} OFF</p>}
                          <p className="text-xs text-slate-400 mt-0.5">{pkg.items.length} items · Ends in {daysLeft} days</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wide px-4 py-2 rounded-xl group-hover:bg-slate-700 transition-colors">
                          Shop Now
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======= PRODUCTS TAB ======= */}
        {activeTab === 'products' && (
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Sidebar Filters */}
            <aside className="w-full lg:w-60 flex-shrink-0 space-y-8 lg:sticky lg:top-24">
              {/* Search */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Search</label>
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search products..." className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-4 py-2.5 text-sm rounded-xl bg-white font-sans"/>
              </div>

              {/* Gender Category */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['All', ...Object.values(ProductCategory)].map(cat => (
                    <button key={cat} onClick={() => { setGenderFilter(cat); setSubCategory('All'); }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-full border transition-all ${genderFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Category */}
              {subCategories.length > 1 && (
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-3">Type</label>
                  <div className="flex flex-col gap-1.5">
                    {subCategories.map(s => (
                      <button key={s} onClick={() => setSubCategory(s || 'All')}
                        className={`text-left text-xs font-medium transition-all py-1 px-2 rounded-lg ${subCategory === s ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-3">Price Range</label>
                <div className="flex flex-col gap-1.5">
                  {PRICE_RANGES.map(r => (
                    <button key={r.value} onClick={() => setPriceRange(r.value)}
                      className={`text-left text-xs font-medium transition-all py-1 px-2 rounded-lg ${priceRange === r.value ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-slate-900"/>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">In Stock Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={onOfferOnly} onChange={e => setOnOfferOnly(e.target.checked)} className="w-4 h-4 accent-rose-500"/>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">On Offer Only 🔥</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-3 py-2.5 text-xs font-medium rounded-xl bg-white">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name A–Z</option>
                </select>
              </div>

              <button onClick={() => { setSearchTerm(''); setGenderFilter('All'); setSubCategory('All'); setPriceRange('all'); setSortBy('default'); setInStockOnly(false); setOnOfferOnly(false); }}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all">
                Reset Filters
              </button>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-500 font-medium">{filteredProducts.length} products found</p>
              </div>

              {isLoading ? (
                <div className="text-sm font-bold text-slate-400 animate-pulse py-24 text-center uppercase tracking-widest">Loading collection...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-slate-500 font-semibold">No products match your filters</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting or resetting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map(product => {
                    const images = getAllImages(product.imageUrl);
                    const isOffer = packageProductIds.has(product.id);
                    const isOutOfStock = product.stock !== undefined && product.stock === 0;
                    return (
                      <div key={product.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => openDrawer(product)}>
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                          {images[0] ? (
                            <img src={images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">👗</div>
                          )}
                          {isOffer && !isOutOfStock && (
                            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-full">OFFER</div>
                          )}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">Out of Stock</span>
                            </div>
                          )}
                          {product.productCategory && !isOutOfStock && (
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-slate-700 text-[9px] font-bold px-2 py-1 rounded-full border border-slate-200">{product.productCategory}</div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{product.subCategory || product.category || ''}</p>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{product.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-black font-mono text-slate-900">Rs. {product.price.toLocaleString()}</p>
                            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                              <span className="text-[9px] text-amber-600 font-bold">Only {product.stock} left</span>
                            )}
                          </div>
                          {product.barcode && <p className="text-[9px] text-slate-300 font-mono mt-1">{product.barcode}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Quick-View Drawer */}
      {drawerProduct && (
        <div className="fixed inset-0 z-[100] flex" onClick={e => { if (e.target === e.currentTarget) setDrawerProduct(null); }}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerProduct(null)}/>
          <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-serif font-bold text-lg text-slate-900 uppercase">Quick View</h3>
              <button onClick={() => setDrawerProduct(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Images */}
            <div className="aspect-square overflow-hidden bg-slate-100">
              {getAllImages(drawerProduct.imageUrl)[activeImageIndex] ? (
                <img src={getAllImages(drawerProduct.imageUrl)[activeImageIndex]} alt={drawerProduct.name} className="w-full h-full object-cover"/>
              ) : <div className="w-full h-full flex items-center justify-center text-6xl text-slate-200">👗</div>}
            </div>
            {getAllImages(drawerProduct.imageUrl).length > 1 && (
              <div className="flex gap-2 px-6 py-3 overflow-x-auto">
                {getAllImages(drawerProduct.imageUrl).map((img, i) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === i ? 'border-slate-900' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 p-6 space-y-6">
              {drawerProduct.productCategory && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{drawerProduct.productCategory} · {drawerProduct.subCategory || drawerProduct.category}</span>}
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">{drawerProduct.name}</h2>
                <p className="text-2xl font-mono font-black text-slate-900 mt-2">Rs. {drawerProduct.price.toLocaleString()}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{drawerProduct.description}</p>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Size</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isBespokeSize} onChange={e => setIsBespokeSize(e.target.checked)} className="w-3.5 h-3.5 accent-slate-900"/>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Custom Bespoke Size</span>
                  </label>
                </div>
                {!isBespokeSize ? (
                  <div className="flex flex-wrap gap-2">
                    {(drawerProduct.sizes?.length ? drawerProduct.sizes : SIZES).map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 text-xs font-bold border rounded-xl transition-all ${selectedSize === s ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {Object.keys(measurements).map(k => (
                      <div key={k}>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">{k}</label>
                        <input type="text" value={(measurements as any)[k]} onChange={e => setMeasurements(m => ({ ...m, [k]: e.target.value }))}
                          placeholder="in inches" className="w-full border border-slate-200 focus:border-slate-400 focus:ring-0 px-3 py-2 text-xs rounded-xl"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {drawerProduct.stock !== undefined && drawerProduct.stock > 0 && drawerProduct.stock <= 10 && (
                <p className="text-xs text-amber-600 font-bold">⚠️ Only {drawerProduct.stock} items left in stock!</p>
              )}
              {drawerProduct.barcode && <p className="text-[10px] text-slate-300 font-mono">SKU: {drawerProduct.barcode}</p>}
            </div>

            <div className="p-6 border-t border-slate-100 space-y-3 sticky bottom-0 bg-white">
              <button onClick={handleAddToCartSubmit} disabled={drawerProduct.stock === 0}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg">
                {drawerProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={() => { onOrderBespoke(drawerProduct); setDrawerProduct(null); }}
                className="w-full py-3 border border-slate-900 text-slate-900 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                Order Custom Tailored
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomProductsPage;