import React from 'react';
import { FiroFitsLogo } from './IconComponents';

const testimonials = [
  {
    name: 'Anusha P.',
    role: 'Loyal Customer',
    comment: "The dress drape was absolutely flawless. The online measuring process is surprisingly easy and accurate.",
  },
  {
    name: 'Fatima R.',
    role: 'Frequent Shopper',
    comment: "Impressed by the quality of the garments. The fabric is beautiful and the stitching is perfect.",
  },
  {
    name: 'David S.',
    role: 'Corporate Client',
    comment: "Sourced uniforms for my team. The delivery was exactly on time, and the fit exceeds standard sizes.",
  }
];

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-32 pb-32 pt-16 max-w-[1400px] mx-auto px-4 md:px-8">
      
      {/* 2026 HERO SECTION */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-black pb-8 gap-8">
          <div>
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-dark-gray block mb-4">Our Story</span>
             <h1 className="text-6xl md:text-[8rem] font-serif leading-[0.85] tracking-tighter uppercase text-black">
                The <br /> <span className="italic font-light text-brand-dark-gray">Atelier.</span>
             </h1>
          </div>
        </div>

        <div className="relative aspect-[21/9] bg-gray-100 overflow-hidden w-full group">
          <img 
            src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop"
            alt="Atelier"
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2s] ease-out"
          />
        </div>
      </section>
      
      {/* OUR STORY SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-black/10 pt-16">
        <div>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-2 inline-block">Vision</span>
           <p className="text-sm font-light text-brand-dark-gray mt-6 leading-relaxed">
             To be the premier destination for custom tailored clothing. Making bespoke, high-quality fashion accessible to everyone.
           </p>
        </div>
        <div>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-2 inline-block">Mission</span>
           <p className="text-sm font-light text-brand-dark-gray mt-6 leading-relaxed">
             To combine premium fabrics with master craftsmanship, translating your ideas into perfectly fitted clothing.
           </p>
        </div>
        <div>
           <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-2 inline-block">Quality</span>
           <p className="text-sm font-light text-brand-dark-gray mt-6 leading-relaxed">
             Delivering an unparalleled shopping experience through transparency, secure checkout, and strict quality control on every stitch.
           </p>
        </div>
      </section>

      {/* MEET THE ARCHITECT SECTION */}
      <section className="bg-black text-white p-8 md:p-16 lg:p-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Head Designer</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-none tracking-tighter uppercase">Firoza Sharmila.</h2>
            <div className="h-[1px] w-full bg-white/20"></div>
            <p className="text-sm font-light text-gray-300 leading-relaxed tracking-wide">
                With over 15 years of experience in high-end tailoring, Firoza is the creative force behind FiroFits. She is driven by a passion to create clothing that provides absolute comfort and a perfect fit for every body shape.
            </p>
            <p className="text-sm font-light text-gray-300 leading-relaxed tracking-wide">
                Whether crafting traditional attire or modern pieces, she possesses an incredible eye for detail. Firoza personally oversees every custom order, ensuring your garment is nothing short of a masterpiece.
            </p>
        </div>
        <div className="order-1 md:order-2">
            <div className="aspect-[3/4] overflow-hidden bg-gray-900 border border-white/10">
                <img 
                    src="https://images.unsplash.com/photo-1599842445123-746096599a9a?q=80&w=800&auto=format&fit=crop"
                    alt="Firoza Sharmila"
                    className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-[1s]"
                />
            </div>
        </div>
      </section>

      {/* TYPOGRAPHIC TESTIMONIALS */}
      <section className="space-y-16">
        <div className="border-b border-black pb-8">
           <h2 className="text-4xl font-serif tracking-tighter uppercase">Customer Reviews.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, i) => (
                <div key={i} className="flex flex-col space-y-6">
                    <p className="text-xl font-serif font-medium leading-relaxed italic text-black">
                      "{testimonial.comment}"
                    </p>
                    <div className="pt-6 border-t border-black/10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">{testimonial.name}</p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-dark-gray mt-1">{testimonial.role}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

    </div>
  );
};

export default AboutPage;