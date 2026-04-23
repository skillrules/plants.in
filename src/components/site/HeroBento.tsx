import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "@/assets/hero_slide_1.png";
import slide2 from "@/assets/hero_slide_2.png";
import slide3 from "@/assets/hero_slide_3.png";
import succulents from "@/assets/bento_succulents.png";
import orchids from "@/assets/bento_orchids.png";

const mainSlides = [
  {
    id: 1,
    image: slide1,
    tag: "STATEMENT PIECES",
    title: "Bring the\njungle home.",
    desc: "Hand-picked indoor & outdoor plants, pots, and accessories — delivered fresh from the nursery to your doorstep.",
  },
  {
    id: 2,
    image: slide2,
    tag: "RARE FINDS",
    title: "Pink\nPrincess.",
    desc: "Discover our limited stock of rare and striking variegated plants. Perfect for collectors.",
  },
  {
    id: 3,
    image: slide3,
    tag: "ELEVATE",
    title: "Minimalist\ngreenery.",
    desc: "Large architectural trees that make an immediate impact in any modern living space.",
  },
];

export function HeroBento() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  return (
    <section className="container mx-auto px-4 pt-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[480px]">
        
        {/* MAIN LEFT CARD (Carousel) */}
        <div className="relative md:col-span-2 rounded-[2rem] overflow-hidden bg-[#1A4C31] text-white flex flex-col min-h-[450px] md:min-h-0 group">
          <div className="overflow-hidden h-full absolute inset-0" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {mainSlides.map((slide) => (
                <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full p-8 sm:p-12 flex flex-col justify-between">
                  
                  {/* Background Image (Aligned to right/bottom) */}
                  <div className="absolute inset-y-0 right-0 w-2/3 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A4C31] via-[#1A4C31]/80 to-transparent z-10" />
                    <img 
                      src={slide.image} 
                      alt="" 
                      className="w-full h-full object-cover object-left opacity-90"
                    />
                  </div>

                  <div className="relative z-20 flex flex-col items-start max-w-md h-full justify-center">
                    <div className="mb-8">
                      <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-sm bg-white/10">
                        {slide.tag}
                      </span>
                      <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6 drop-shadow-sm whitespace-pre-line">
                        {slide.title}
                      </h1>
                      <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                        {slide.desc}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Link 
                        to="/shop" 
                        className="bg-white text-[#1A4C31] hover:bg-white/90 font-medium px-8 py-3.5 rounded-full transition-all flex items-center gap-2 hover:gap-3"
                      >
                        Explore the shop <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link 
                        to="/shop" 
                        className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1 group/link"
                      >
                        or browse indoor plants <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-8 sm:left-12 flex gap-2 z-30">
            {mainSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-8 h-1.5 bg-white"
                    : "w-2 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (Stacks 2 smaller cards) */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* TOP RIGHT CARD */}
          <Link 
            to="/shop" 
            className="group relative flex-1 rounded-[2rem] overflow-hidden bg-[#FFD6C9] p-6 sm:p-8 flex flex-row items-center transition-transform hover:-translate-y-1 min-h-[220px]"
          >
            <div className="relative z-10 flex-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/60 mb-2 block">
                MINI GARDEN
              </span>
              <h2 className="font-serif text-3xl text-black leading-tight mb-4">
                Succulents<br />from ₹299
              </h2>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-black/80 group-hover:gap-2 transition-all">
                Shop now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-[45%]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD6C9] to-transparent z-10" />
              <img 
                src={succulents} 
                alt="Succulents" 
                className="w-full h-full object-cover object-left"
              />
            </div>
          </Link>

          {/* BOTTOM RIGHT CARD */}
          <Link 
            to="/shop" 
            className="group relative flex-1 rounded-[2rem] overflow-hidden bg-[#C5E9C9] p-6 sm:p-8 flex flex-row items-center transition-transform hover:-translate-y-1 min-h-[220px]"
          >
            <div className="relative z-10 flex-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/60 mb-2 block">
                LIMITED EDITION
              </span>
              <h2 className="font-serif text-3xl text-black leading-tight mb-4">
                Orchid<br />Bouquets
              </h2>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-black/80 group-hover:gap-2 transition-all">
                Discover <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-[45%]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C5E9C9] to-transparent z-10" />
              <img 
                src={orchids} 
                alt="Orchids" 
                className="w-full h-full object-cover object-left"
              />
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
