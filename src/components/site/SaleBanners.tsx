import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import img1 from "@/assets/product-jade.jpg";
import img2 from "@/assets/product-succulent.jpg";

export function SaleBanners() {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1 */}
        <Link to="/shop" className="group relative flex flex-col justify-center overflow-hidden bg-[#f6f6f6] p-8 md:p-12 min-h-[300px] sm:min-h-[340px] transition-colors hover:bg-[#f0f0f0]">
          <div className="relative z-10 max-w-[60%]">
            <span className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
              Big Sale Products
            </span>
            <h3 className="mt-2 text-3xl sm:text-4xl font-display text-foreground leading-tight">
              Plants<br />For Interior
            </h3>
            <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground transition-all duration-300 border-b-2 border-primary pb-1 group-hover:text-primary-deep group-hover:border-primary-deep">
              SHOP NOW
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
          <img 
            src={img1} 
            alt="Interior Plants" 
            className="absolute -right-8 sm:right-0 bottom-0 h-[120%] w-auto object-contain object-bottom mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        </Link>

        {/* Banner 2 */}
        <Link to="/shop" className="group relative flex flex-col justify-center overflow-hidden bg-[#f6f6f6] p-8 md:p-12 min-h-[300px] sm:min-h-[340px] transition-colors hover:bg-[#f0f0f0]">
          <div className="relative z-10 max-w-[60%]">
            <span className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
              Top Products
            </span>
            <h3 className="mt-2 text-3xl sm:text-4xl font-display text-foreground leading-tight">
              Plants<br />For Healthy
            </h3>
            <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground transition-all duration-300 border-b-2 border-primary pb-1 group-hover:text-primary-deep group-hover:border-primary-deep">
              SHOP NOW
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
          <img 
            src={img2} 
            alt="Healthy Plants" 
            className="absolute -right-8 sm:right-0 bottom-0 h-[120%] w-auto object-contain object-bottom mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        </Link>

      </div>
    </section>
  );
}
