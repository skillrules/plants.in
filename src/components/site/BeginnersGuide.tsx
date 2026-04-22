import plantImg from "@/assets/guide-plant.png";
import leavesImg from "@/assets/guide-leaves.png";

export function BeginnersGuide() {
  return (
    <section className="container mx-auto px-4 my-12">
      <div className="relative w-full overflow-hidden py-12 md:py-16 bg-[#fcfcf9] rounded-[2rem] shadow-sm border border-border/50">
        {/* Decorative Leaves */}
        <img 
          src={leavesImg} 
          alt="" 
          className="absolute -top-10 -left-10 w-40 md:w-56 h-auto object-contain opacity-70 mix-blend-multiply rotate-[135deg] pointer-events-none" 
        />
        <img 
          src={leavesImg} 
          alt="" 
          className="absolute -bottom-10 -right-10 w-40 md:w-56 h-auto object-contain opacity-70 mix-blend-multiply -rotate-[45deg] pointer-events-none" 
        />

        <div className="relative z-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-center text-foreground mb-8">
            A Beginners Guide
          </h2>

          <div className="relative max-w-4xl mx-auto h-[250px] md:h-[300px] flex items-center justify-center">
            
            {/* Plant Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img 
                src={plantImg} 
                alt="Houseplant" 
                className="h-[90%] w-auto object-contain mix-blend-multiply drop-shadow-sm" 
              />
            </div>

            {/* Left Top Label */}
            <div className="absolute top-[20%] left-0 w-[45%] md:w-[40%] flex items-center justify-end gap-2 md:gap-4 text-right z-10">
              <p className="font-semibold text-foreground/90 max-w-[120px] md:max-w-[160px] text-[10px] sm:text-xs md:text-sm leading-snug">
                Receive Clear care guidance with every order
              </p>
              <svg viewBox="0 0 60 10" className="hidden sm:block w-8 md:w-12 h-1.5 md:h-2 text-[#2a8754] fill-current">
                <path d="M0 4h56v2H0z"/><path d="M54 0l6 5-6 5v-10z"/>
              </svg>
            </div>

            {/* Left Bottom Label */}
            <div className="absolute top-[70%] left-0 w-[45%] md:w-[40%] flex items-center justify-end gap-2 md:gap-4 text-right z-10">
              <p className="font-semibold text-foreground/90 max-w-[120px] md:max-w-[160px] text-[10px] sm:text-xs md:text-sm leading-snug">
                Feed regularly with organic compost
              </p>
              <svg viewBox="0 0 60 10" className="hidden sm:block w-8 md:w-12 h-1.5 md:h-2 text-[#2a8754] fill-current">
                <path d="M0 4h56v2H0z"/><path d="M54 0l6 5-6 5v-10z"/>
              </svg>
            </div>

            {/* Right Top Label */}
            <div className="absolute top-[20%] right-0 w-[45%] md:w-[40%] flex items-center justify-start gap-2 md:gap-4 text-left z-10">
              <svg viewBox="0 0 60 10" className="hidden sm:block w-8 md:w-12 h-1.5 md:h-2 text-[#2a8754] fill-current">
                <path d="M4 4h56v2H4z"/><path d="M6 0L0 5l6 5v-10z"/>
              </svg>
              <p className="font-semibold text-foreground/90 max-w-[120px] md:max-w-[160px] text-[10px] sm:text-xs md:text-sm leading-snug">
                Wipe leaves gently with a damp cloth
              </p>
            </div>

            {/* Right Bottom Label */}
            <div className="absolute top-[70%] right-0 w-[45%] md:w-[40%] flex items-center justify-start gap-2 md:gap-4 text-left z-10">
              <svg viewBox="0 0 60 10" className="hidden sm:block w-8 md:w-12 h-1.5 md:h-2 text-[#2a8754] fill-current">
                <path d="M4 4h56v2H4z"/><path d="M6 0L0 5l6 5v-10z"/>
              </svg>
              <p className="font-semibold text-foreground/90 max-w-[120px] md:max-w-[160px] text-[10px] sm:text-xs md:text-sm leading-snug">
                Use well-drained soil and the right pot
              </p>
            </div>

            {/* Bottom Center Label */}
            <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 text-center w-full z-10">
              <p className="font-semibold text-foreground/90 text-[10px] sm:text-xs md:text-sm">
                Water when the top soil feels dry
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
