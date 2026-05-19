import React from 'react';
import { type View } from '../types';

// @ts-ignore
import loyaltyBannerImg from '../uploads/loyalty_banner_models.png';
// @ts-ignore
import heroSlideOne from '../uploads/hero_slide_one.png';
// @ts-ignore
import heroSlideTwo from '../uploads/hero_slide_two.png';
// @ts-ignore
import heroSlideThree from '../uploads/hero_slide_thr.png';

interface HomePageProps {
  navigateTo: (view: View) => void;
  isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, isLoggedIn }) => {
  const headings = React.useMemo(() => [
    { primary: "Tailoring", secondary: "Made Simple." },
    { primary: "Perfect Fits", secondary: "Just For You." },
    { primary: "Modern Designs", secondary: "With Care." },
    { primary: "Custom Dresses", secondary: "Crafted To Fit." }
  ], []);

  const [index, setIndex] = React.useState(0);
  const [animate, setAnimate] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % headings.length);
        setAnimate(true);
      }, 500);
    }, 4000);

    return () => clearInterval(timer);
  }, [headings.length]);

  const heroImages = React.useMemo(() => [
    { src: heroSlideOne, position: "object-[center_15%]" }, // Shift suit form down to show the neckline/hanger
    { src: heroSlideTwo, position: "object-[center_10%]" }, // Shift standing model down to show the head/upper body
    { src: heroSlideThree, position: "object-center" }     // Close-up looks best centered
  ], []);

  const [imageIndex, setImageIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="animate-fade-in space-y-36 pb-28 pt-0">

      {/* 2026 FULL SCREEN LENGTH HERO SLIDER */}
      <section className="w-full relative border-b border-black overflow-hidden bg-white aspect-square sm:aspect-[16/9] md:aspect-[1920/800]">
        {/* Background: Image Slider (Full Width) with Unique Ken Burns Crossfade Transition */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          {heroImages.map((slide, i) => {
            const isActive = imageIndex === i;
            return (
              <div 
                key={i} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-[1000ms] ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={slide.src} 
                  alt={`Luxury clothing slide ${i + 1}`}
                  className={`w-full h-full object-cover ${slide.position} transition-transform duration-[4500ms] ease-out ${
                    isActive ? 'scale-[1.06]' : 'scale-100'
                  }`} 
                />
              </div>
            );
          })}

          {/* Dots */}
          <div className="absolute bottom-6 left-6 md:left-12 flex gap-2 z-20">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  imageIndex === i ? 'bg-black w-4' : 'bg-black/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Faded White Gradient Overlay on the Right (Desktop) or Bottom (Mobile) */}
        <div className="absolute inset-x-0 bottom-0 top-[45%] md:top-0 md:left-auto md:right-0 md:w-[45%] lg:w-[35%] bg-gradient-to-t md:bg-gradient-to-l from-white via-white/95 to-transparent z-10"></div>

        {/* Action Buttons overlaid on the right/bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] md:h-auto md:top-0 md:left-auto md:right-0 md:w-[45%] lg:w-[35%] flex items-center justify-center p-6 md:p-12 z-20">
          <div className="flex flex-col gap-4 w-full max-w-[280px] md:max-w-[320px]">
            <button
              onClick={() => navigateTo('products')}
              className="w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-gray-900 transition-all hover:-translate-y-0.5 duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              Explore Collection
            </button>
            <button
              onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}
              className="w-full py-5 bg-transparent border border-black text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all hover:-translate-y-0.5 duration-300"
            >
              Request Custom Fit
            </button>
          </div>
        </div>
      </section>

      {/* 2026 HERO TEXT CONTENT */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto text-center space-y-6 pt-4">
        <h1 className={`text-6xl md:text-8xl lg:text-[9rem] font-serif leading-[0.85] tracking-tighter uppercase text-black transition-all duration-700 ease-out transform ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          {headings[index].primary} <br />
          <span className="italic font-light text-brand-dark-gray tracking-normal">
            {headings[index].secondary}
          </span>
        </h1>

        <p className="text-sm md:text-base font-sans max-w-2xl mx-auto text-brand-dark-gray font-light tracking-wide leading-relaxed">
          Discover beautifully crafted clothing made with high-quality fabrics and modern styles, tailored perfectly to fit you.
        </p>
      </section>

      {/* Premium Asymmetrical Bento Grid */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[650px]">
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
                2026 Fashion Showcase
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
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400">Quality Fabrics</span>
              <h3 className="font-serif text-3xl text-black">Pure Linen.</h3>
              <p className="text-[10px] font-sans text-brand-dark-gray font-semibold uppercase tracking-[0.15em] leading-relaxed">
                Hand-picked natural fabrics designed to keep you cool, comfortable, and looking stylish.
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
            Clothes designed and stitched perfectly to fit your unique measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Card 1 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">01 / CUSTOM FIT</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Custom Tailoring</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Share your style ideas, enter your measurements, and our expert tailors will create a custom outfit delivered straight to your door.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo('products')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">02 / READY TO WEAR</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Boutique Shop</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Explore our collection of high-quality, ready-made outfits. Crafted with the same attention to detail as our custom-made items.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-6 group cursor-pointer" onClick={() => navigateTo(isLoggedIn ? 'order' : 'login')}>
            <div className="h-[1px] w-full bg-black/20 group-hover:bg-black transition-colors duration-500"></div>
            <div className="flex justify-between items-center">
              <span className="text-brand-dark-gray text-[9px] font-extrabold tracking-[0.3em]">03 / BULK ORDERS</span>
              <svg className="w-4 h-4 text-black transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Uniform Orders</h3>
            <p className="text-xs font-light text-brand-dark-gray leading-relaxed">
              Order high-quality office, school, and work uniforms. Built for all-day comfort, durability, and a clean professional look.
            </p>
          </div>
        </div>
      </section>

      {/* ATELIER CRAFTSMANSHIP & STATS SECTION */}
      <section className="bg-gray-50 border-y border-black/5 py-16 px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Image */}
        <div className="aspect-[16/9] md:aspect-[16/10] bg-gray-100 border border-black/10 relative overflow-hidden group">
          <img 
            src={loyaltyBannerImg} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
            alt="Atelier Craftsmanship"
          />
        </div>

        {/* Right Column: Text Content & Stats */}
        <div className="flex flex-col items-start text-left space-y-8 px-4 lg:px-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-dark-gray font-bold block">The Atelier Heritage</span>
            <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight tracking-tight uppercase">
              Master Craftsmanship
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold text-black/70">
              Led by Master Tailor: <span className="underline decoration-1 underline-offset-4 text-black">Firosiya Begam</span>
            </p>
          </div>
          
          <p className="text-xs font-sans text-gray-500 font-light leading-relaxed max-w-lg">
            Every garment that leaves our studio is meticulously hand-cut, pinned, and stitched to perfection. Guided by over a decade of luxury tailoring experience, we bring architectural precision to ready-to-wear and bespoke garments alike.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-6 w-full border-t border-black/10">
            <div>
              <p className="text-3xl font-serif text-black font-semibold">15+</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mt-1">Years of Experience</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-black font-semibold">10,000+</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mt-1">Completed Orders</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-black font-semibold">100%</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mt-1">Fit & Finish Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-serif text-black font-semibold">Bespoke</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-dark-gray font-bold mt-1">Hand-Drafted Patterns</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
