import React, { useState, useEffect } from 'react';
import { type Product, type Measurements } from '../types';
import { getProducts } from '../services/supabaseClient';
import { SearchIcon } from './IconComponents';

interface CustomProductsPageProps {
  onAddToCart: (product: Product, size: string, customMeasurements?: Measurements) => void;
  onOrderBespoke: (product: Product) => void;
}

const CustomProductsPage: React.FC<CustomProductsPageProps> = ({ onAddToCart, onOrderBespoke }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isBespokeSize, setIsBespokeSize] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>({
    shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '',
  });

  useEffect(() => {
    const fetchProds = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProds();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange === 'under-10') matchesPrice = product.price < 10000;
      else if (priceRange === '10-15') matchesPrice = product.price >= 10000 && product.price <= 15000;
      else if (priceRange === 'over-15') matchesPrice = product.price > 15000;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

  const openDrawer = (product: Product) => {
    setDrawerProduct(product);
    setSelectedSize('M');
    setIsBespokeSize(false);
    setMeasurements({ shoulder: '', chest: '', waist: '', hip: '', fullLength: '', vestLength: '', sleeveLength: '', armhole: '', collarSize: '' });
  };

  const closeDrawer = () => setDrawerProduct(null);

  const handleAddToCartSubmit = () => {
    if (!drawerProduct) return;
    onAddToCart(drawerProduct, isBespokeSize ? 'Bespoke Custom' : selectedSize, isBespokeSize ? measurements : undefined);
    closeDrawer();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange('all');
    setSortBy('default');
  };

  return (
    <div className="animate-fade-in space-y-16 pb-32 pt-20 max-w-[1400px] mx-auto px-4 md:px-8">
      
      {/* 2026 MINIMALIST HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase leading-none">Shop Collection.</h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-dark-gray mt-4 max-w-sm">
            Browse our ready-to-wear designs and premium custom products.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* ADVANCED SIDEBAR FILTERS (LEFT COLUMN) */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10 lg:border-r lg:border-black/10 lg:pr-8">
          
          {/* SEARCH DATABASE */}
          <div className="space-y-4">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-black/20 bg-gray-50 focus:border-black focus:ring-0 px-4 py-3 text-xs uppercase tracking-widest placeholder-gray-400 transition-colors rounded-none font-sans"
              />
            </div>
          </div>

          {/* COLLECTIONS */}
          <div className="space-y-4">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black">
              Collections
            </label>
            <div className="flex flex-col space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category || 'All')}
                  className={`text-left text-xs uppercase tracking-[0.1em] font-medium transition-all py-1 border-b border-transparent ${
                    selectedCategory === category 
                      ? 'text-black font-bold pl-2 border-l border-black' 
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="space-y-4">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black">
              Price Range
            </label>
            <div className="flex flex-col space-y-2">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-10', label: 'Under Rs. 10,000' },
                { id: '10-15', label: 'Rs. 10,000 - Rs. 15,000' },
                { id: 'over-15', label: 'Over Rs. 15,000' }
              ].map(range => (
                <label key={range.id} className="flex items-center gap-5 cursor-pointer text-xs uppercase tracking-wider text-gray-500 hover:text-black transition-colors font-medium">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === range.id}
                    onChange={() => setPriceRange(range.id)}
                    className="h-3 w-3 rounded-none border border-black/20 text-black focus:ring-0 cursor-pointer mr-1"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SORT BY */}
          <div className="space-y-4">
            <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-black">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-black/20 bg-gray-50 focus:border-black focus:ring-0 px-4 py-3 text-xs uppercase tracking-widest text-black rounded-none cursor-pointer font-sans font-bold"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>

          {/* RESET BUTTON */}
          <button
            onClick={handleResetFilters}
            className="w-full py-4 border border-black text-black text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors rounded-none"
          >
            Clear Filters
          </button>

        </aside>

        {/* 2026 BRUTALIST PRODUCT GRID (RIGHT COLUMN) */}
        <main className="flex-grow w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => openDrawer(product)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Borderless Flush Image */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="px-6 py-3 bg-white text-black text-[9px] uppercase tracking-[0.2em] font-bold shadow-2xl">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Minimal Text specifications */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-sans font-medium text-black tracking-wide uppercase">
                        {product.name}
                      </h3>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mt-1 block">
                        {product.category || 'Core'}
                      </span>
                    </div>
                    <p className="text-xs font-serif font-bold text-black">
                      Rs. {product.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-black/10 w-full">
              <h3 className="text-2xl font-serif text-black uppercase tracking-widest">No Products Found</h3>
              <p className="text-brand-dark-gray text-xs tracking-widest uppercase mt-4">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 2026 HIGH-END SIDE DRAWER */}
      <div className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-500 ${drawerProduct ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={closeDrawer} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"></div>
        <div className={`absolute inset-y-0 right-0 max-w-lg w-full bg-white flex flex-col justify-between transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${drawerProduct ? 'translate-x-0' : 'translate-x-full'}`}>
          {drawerProduct && (
            <>
              {/* Drawer Header */}
              <div className="p-8 flex justify-between items-start">
                <div>
                  <span className="text-[8px] uppercase tracking-[0.3em] text-brand-dark-gray font-bold">
                    {drawerProduct.category || 'Core'}
                  </span>
                  <h2 className="text-3xl font-serif text-black uppercase tracking-tighter mt-2 leading-none">
                    {drawerProduct.name}
                  </h2>
                </div>
                <button onClick={closeDrawer} className="text-black hover:scale-90 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Drawer Body */}
              <div className="px-8 overflow-y-auto space-y-8 flex-grow pb-8 custom-scrollbar">
                <div className="aspect-[4/5] bg-gray-100 relative">
                  <img src={drawerProduct.imageUrl} alt={drawerProduct.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 text-xs font-serif font-bold shadow-xl">
                    Rs. {drawerProduct.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-dark-gray">Product Details</h4>
                  <p className="text-xs text-black font-light leading-relaxed tracking-wide">
                    {drawerProduct.description}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-black/10"></div>

                <div className="space-y-6">
                  <label className="block text-[9px] uppercase tracking-[0.2em] font-bold text-black">
                    Choose Size Type
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-sm">
                    <button type="button" onClick={() => setIsBespokeSize(false)} className={`flex-1 py-3 text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${!isBespokeSize ? 'bg-black text-white' : 'text-brand-dark-gray hover:text-black'}`}>Standard</button>
                    <button type="button" onClick={() => setIsBespokeSize(true)} className={`flex-1 py-3 text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${isBespokeSize ? 'bg-black text-white' : 'text-brand-dark-gray hover:text-black'}`}>Bespoke (Free)</button>
                  </div>

                  {!isBespokeSize ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`h-12 w-12 border text-xs font-bold transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-black/20 text-black hover:border-black'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <p className="text-[10px] text-brand-dark-gray font-light">Input exact physical dimensions (inches).</p>
                      <div className="grid grid-cols-2 gap-4">
                        {['shoulder', 'chest', 'waist', 'hip', 'fullLength', 'sleeveLength'].map(field => (
                          <div key={field}>
                            <label className="block text-[8px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mb-3">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input type="text" placeholder="in" value={(measurements as any)[field]} onChange={(e) => setMeasurements({ ...measurements, [field]: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border-0 border-b border-black/20 focus:border-black focus:ring-0 text-xs text-center rounded-none font-bold font-sans" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-8 border-t border-black/10 bg-white space-y-4">
                <button onClick={handleAddToCartSubmit} className="w-full py-5 bg-black hover:bg-gray-900 text-white font-bold uppercase text-[10px] tracking-[0.3em] transition-all">
                  {isBespokeSize ? 'Add Custom Dress to Cart' : 'Add to Cart'}
                </button>
                <button type="button" onClick={() => { closeDrawer(); onOrderBespoke(drawerProduct); }} className="w-full py-4 bg-transparent border border-black hover:bg-black hover:text-white text-black font-bold uppercase text-[9px] tracking-[0.3em] transition-all">
                  Start Custom Tailoring
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomProductsPage;