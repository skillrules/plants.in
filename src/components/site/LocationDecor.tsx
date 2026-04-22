import { Link } from "@tanstack/react-router";
import imgLowLight from "@/assets/decor-low-light-balcony.png";
import imgBright from "@/assets/decor-bright-balcony.png";
import imgLiving from "@/assets/decor-living-room.png";
import imgBedroom from "@/assets/decor-bedroom.png";
import imgOffice from "@/assets/decor-office.png";
import imgStudy from "@/assets/decor-study-room.png";

const locations = [
  { name: "Low Light Balconies", image: imgLowLight },
  { name: "Bright Light Balconies", image: imgBright },
  { name: "Living Room", image: imgLiving },
  { name: "Bedroom", image: imgBedroom },
  { name: "Office", image: imgOffice },
  { name: "Study Room", image: imgStudy },
];

export function LocationDecor() {
  return (
    <section className="container mx-auto px-4 pt-12 pb-6 md:pt-20 md:pb-10 text-center">
      <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-foreground">
        GREEN DECOR FOR EVERY LOCATION
      </h2>
      <div className="mx-auto mt-6 mb-12 h-1 w-20 bg-foreground"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
        {locations.map((loc) => (
          <Link 
            key={loc.name} 
            to="/shop" 
            className="group flex flex-col items-center gap-4"
          >
            <div className="aspect-square w-full overflow-hidden rounded-3xl bg-secondary/40 shadow-soft transition-smooth group-hover:shadow-elegant">
              <img 
                src={loc.image} 
                alt={loc.name} 
                loading="lazy" 
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary-deep transition-colors">
              {loc.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
