import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 shrink-0 mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover shadow-glow"
              />
              <span className="font-display font-bold text-xl tracking-tight text-foreground">Plantsin</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Bring nature indoors. We deliver the freshest, most beautiful plants right to your doorstep with a 30-day health guarantee.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-secondary/50 border-transparent focus-visible:bg-background rounded-full"
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3.5">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">All Plants</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pet Friendly</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Low Light Plants</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pots & Planters</Link></li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3.5">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/return-refund" className="text-muted-foreground hover:text-primary transition-colors text-sm">Return & Refund Policy</Link></li>
              <li><Link to="/page/$slug" params={{ slug: "track-order" }} className="text-muted-foreground hover:text-primary transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-sm uppercase tracking-wider">Get in Touch</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-deep" />
                <span>Kolkata, West Bengal, 700137</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary-deep" />
                <span>+91 8240665500</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary-deep" />
                <span>contact@plantsin.com</span>
              </li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary-deep transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary-deep transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary-deep transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary-deep transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Plantsin. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms and Conditions</Link>
            <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">Disclaimer</Link>
            <Link to="/return-refund" className="text-muted-foreground hover:text-foreground transition-colors">Return and Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
