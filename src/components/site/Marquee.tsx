import { Truck, Sprout, CreditCard, Headphones } from "lucide-react";

const items = [
  { icon: Truck, text: "Free Delivery From ₹500" },
  { icon: Sprout, text: "Fresh Plants Every Day" },
  { icon: CreditCard, text: "Safe Payment With Any Bank Card" },
  { icon: Headphones, text: "24/7 Support Always There For You" },
  { icon: Truck, text: "30-Day Plant Health Guarantee" },
  { icon: Sprout, text: "Eco-Friendly Packaging" },
];

export function Marquee() {
  const loop = [...items, ...items];
  return (
    <section className="container mx-auto px-4 mt-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card py-4 shadow-soft">
        <div className="flex w-max animate-marquee gap-12 px-6">
          {loop.map((it, i) => {
            const Icon = it.icon;
            return (
              <div key={i} className="flex shrink-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary-deep" />
                </div>
                <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
                  {it.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
