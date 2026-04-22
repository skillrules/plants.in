import { Star } from "lucide-react";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";

const reviews = [
  {
    name: "AARTHYRAJKUMAR",
    text: "Very well packed, saplings are very healthy, and instructions are thoroughly given, over all good experience for online sapling shopping.",
    avatar: avatar1,
  },
  {
    name: "TEJA GAWANKAR",
    text: "Sapling was packed properly, was is good condition and healthy one.",
    avatar: avatar2,
  },
  {
    name: "SUPRIYA",
    text: "Received healthy and very nice plant...thank you so much affordable organics... I love it so much.",
    avatar: avatar3,
  },
  {
    name: "SONALI",
    text: "I received the plant today...in vry good condition as usual...like my previous purchases... I'm Vry happy 🤩🤩",
    avatar: avatar1,
  },
];

export function CustomerReviews() {
  return (
    <section className="w-full bg-[#1b8b5e] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center text-white mb-12">
          Customer Reviews
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-lg"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed text-[15px] md:text-base">
                  {review.text}
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-border/50"
                  loading="lazy"
                />
                <span className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
