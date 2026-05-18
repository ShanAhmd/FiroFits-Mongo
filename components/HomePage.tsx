import React from 'react';
import { type View } from '../types';

interface HomePageProps {
  navigateTo: (view: View) => void;
  isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, isLoggedIn }) => {
  return (
    <div className="animate-fade-in space-y-36 pb-28 pt-12">
      
      {/* 2026 LUXURY HERO SECTION */}
      <section className="px-4 md:px-8 space-y-16 max-w-[1400px] mx-auto text-center">
        <div className="space-y-8">
          <div className="flex justify-center items-center gap-3">
            <span className="h-[1px] w-8 bg-black/30"></span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-extrabold text-brand-dark-gray">Studio Atelier • Est. Colombo</span>
            <span className="h-[1px] w-8 bg-black/30"></span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif leading-[0.85] tracking-tighter uppercase text-black">
            Tailoring <br /> <span className="italic font-light text-brand-dark-gray tracking-normal">Redefined.</span>
          </h1>

          <p className="text-sm md:text-base font-sans max-w-xl mx-auto text-brand-dark-gray font-light tracking-wide leading-relaxed">
            Where precision architectural design meets absolute minimalist elegance. Discover ready-to-wear silhouettes and custom bespoke couture engineered to fit you flawlessly.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-5">
            <button
              onClick={() => navigateTo('products')}
              className="px-10 py-4.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-900 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 duration-300"
            >
              Explore Collection
            </button>
            <button
              onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}
              className="px-10 py-4.5 bg-transparent border border-black text-black text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all hover:-translate-y-0.5 duration-300"
            >
              Request Custom Fit
            </button>
          </div>
        </div>

        {/* Premium Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[650px] pt-6">
          {/* Main Large Block */}
          <div className="md:col-span-8 relative overflow-hidden group border border-black/10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] bg-gray-50">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
              alt="Couture"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[15%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <span className="bg-white text-black px-5 py-2.5 text-[9px] uppercase tracking-[0.25em] font-extrabold shadow-lg">
                SS 26 Couture Showcase
              </span>
            </div>
          </div>

          {/* Side Stack */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-1 relative overflow-hidden group border border-black/10 bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800"
                alt="Linen"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[15%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
            <div className="flex-1 bg-gray-50 border border-black p-10 flex flex-col justify-end text-left space-y-3">
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400">Premium Raw Fabrics</span>
              <h3 className="font-serif text-3xl text-black">Organic Linens.</h3>
              <p className="text-[10px] font-sans text-brand-dark-gray font-semibold uppercase tracking-[0.15em] leading-relaxed">
                Hand-sourced premium textiles custom tailored for absolute breathability and structured style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMALIST ARCHITECTURAL SERVICES */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-black/10 pb-8 gap-6">
          <div>
            <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400 block mb-2">Our Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase">Our Services.</h2>
          </div>
          <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-brand-dark-gray max-w-xs text-right hidden md:block leading-relaxed">
            Tailoring designed meticulously around your signature posture and measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Card 1 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">01 / BESPOKE</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Custom Tailoring</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Upload your reference sketches, insert tailored measurements, and our master stitchers will craft a signature dress delivered directly to your door.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo('products')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">02 / COLLECTION</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Boutique Shop</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Discover ready-to-wear luxury garments. Cut from standard sizing matrices but finished with the same handcrafted refinement as custom couture.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">03 / INSTITUTIONAL</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Uniform Orders</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Premium tier office, boutique hospitality, and institutional uniforms engineered for absolute all-day comfort and sharp architectural lines.
            </p>
          </div>
        </div>
      </section>

      {/* WHY US STORYTELLING SECTION */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400 block mb-2">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tighter uppercase leading-none">Structured To Fit.<br/>Designed To Last.</h2>
          </div>
          <p className="text-xs text-brand-dark-gray leading-relaxed font-light">
            We believe that clothing shouldn't just sit on you—it should complement your natural posture. Firofits combines old-world bespoke tailoring techniques with a high-end modern design philosophy, creating structured, architectural garments that exude silent luxury.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div>
              <span className="block font-serif text-3xl font-bold">100%</span>
              <span className="block text-[8px] uppercase tracking-wider text-gray-400 mt-1">Hand-finished Details</span>
            </div>
            <div>
              <span className="block font-serif text-3xl font-bold">SS26</span>
              <span className="block text-[8px] uppercase tracking-wider text-gray-400 mt-1">Ready-to-Wear Line</span>
            </div>
            <div>
              <span className="block font-serif text-3xl font-bold">15+</span>
              <span className="block text-[8px] uppercase tracking-wider text-gray-400 mt-1">Master Tailors</span>
            </div>
          </div>
        </div>
        <div className="aspect-[4/3] bg-gray-50 border border-black/10 relative overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale-[20%]" 
            alt="Atelier workspace"
          />
        </div>
      </section>

      {/* 2026 BRUTALIST SIGNATURE BANNER */}
      <section className="bg-black text-white py-36 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-15">
           <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1600" className="w-full h-full object-cover" alt="Texture"/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-8">
           <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Quality Tailoring Legacy</p>
           <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tighter">
             Tailored To <br /> <span className="italic font-light">Perfection.</span>
           </h2>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
