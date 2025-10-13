import React from 'react';
import { FiroFitsLogo, StarIcon } from './IconComponents';

const testimonials = [
  {
    name: 'Anusha P.',
    rating: 5,
    comment: "The saree blouse FiroFits made for me was absolutely perfect! The fit, the finish, everything was beyond my expectations. The online process was so easy.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=facearea&facepad=2&ixlib=rb-4.0.3'
  },
  {
    name: 'Fatima R.',
    rating: 5,
    comment: "I'm so impressed with the quality of my new Abaya. The fabric is beautiful and the stitching is flawless. It's so convenient to have this service in Sri Lanka.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=facearea&facepad=2&ixlib=rb-4.0.3'
  },
  {
    name: 'David S.',
    rating: 4,
    comment: "Got my son's school uniform stitched. The process was smooth and the delivery was on time. The fit is much better than ready-made ones.",
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=256&auto=format&fit=facearea&facepad=2&ixlib=rb-4.0.3'
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1542044896530-05d85be9b115?q=80&w=1943&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551821793-b69397a8274f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552902039-a4ac911624c1?q=80&w=1968&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594938392183-5d6c88829a26?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618453292458-73575005b694?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545044458-05b1945037e8?q=80&w=2070&auto=format&fit=crop",
];

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-brand-charcoal text-white text-center py-20 px-4 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop')"}}
        ></div>
        <div className="relative z-10">
          <FiroFitsLogo className="h-20 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold mt-4">Your Vision, Our Craft.</h1>
          <p className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto">Redefining the personal tailoring experience with passion, precision, and convenience.</p>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
                <h2 className="text-2xl font-bold text-brand-charcoal">Our Vision</h2>
                <p className="text-brand-dark-gray mt-2">To be the most trusted and innovative custom tailoring platform, making bespoke fashion accessible to everyone.</p>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-brand-charcoal">Our Mission</h2>
                <p className="text-brand-dark-gray mt-2">To seamlessly connect customers with skilled craftsmanship, turning their unique design ideas into perfectly fitted, high-quality garments.</p>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-brand-charcoal">Our Aim</h2>
                <p className="text-brand-dark-gray mt-2">To deliver an unparalleled customer experience through convenience, transparency, and a commitment to quality in every stitch.</p>
            </div>
        </div>
      </div>

      {/* Meet the Tailor Section */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto py-16 px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold text-brand-charcoal">Meet Our Expert Tailor</h2>
                    <p className="text-xl font-semibold text-brand-teal mt-1">Firoza Sharmila - Founder & Head Tailor</p>
                    <p className="text-brand-dark-gray mt-4">
                        With over 15 years of professional experience in the art of tailoring, Firoza is the heart and soul of FiroFits. Her journey began with a passion for creating perfectly fitted garments that bring joy and confidence to those who wear them.
                    </p>
                    <p className="text-brand-dark-gray mt-3">
                        Specializing in both traditional Sri Lankan attire and modern Western wear, she possesses a keen eye for detail and an unwavering commitment to quality. Firoza personally oversees every order to ensure that each piece is not just a garment, but a masterpiece of craftsmanship tailored to your unique vision.
                    </p>
                </div>
                <div className="order-1 md:order-2">
                    <img 
                        src="https://images.unsplash.com/photo-1599842445123-746096599a9a?q=80&w=800&auto=format&fit=crop"
                        alt="Firoza Sharmila, Head Tailor at FiroFits"
                        className="rounded-2xl shadow-xl w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Image Scroller */}
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] py-12">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
          {galleryImages.map((src, i) => (
            <li key={i}><img src={src} className="h-64 w-auto rounded-2xl shadow-lg" alt="" /></li>
          ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
          {galleryImages.map((src, i) => (
            <li key={i}><img src={src} className="h-64 w-auto rounded-2xl shadow-lg" alt="" /></li>
          ))}
        </ul>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-brand-charcoal text-center mb-10">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-brand-light-gray flex flex-col">
                    <div className="flex items-center mb-4">
                        <img className="h-12 w-12 rounded-full object-cover mr-4" src={testimonial.image} alt={testimonial.name} />
                        <div>
                            <p className="font-bold text-brand-charcoal">{testimonial.name}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, starIndex) => (
                                    <StarIcon key={starIndex} className={`w-5 h-5 ${starIndex < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}/>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-brand-dark-gray text-sm flex-grow">"{testimonial.comment}"</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;