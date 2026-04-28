import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          Contact Us
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p>We'd love to hear from you! Whether you have a question about an order, need plant care advice, or just want to share some feedback, our team is here to help.</p>

          <div className="bg-secondary/30 p-8 rounded-xl my-8">
            <h3 className="font-bold mb-4 text-foreground mt-0">Get in Touch</h3>
            <p className="text-muted-foreground mb-2"><strong>Email:</strong> <a href="mailto:contact@plantsin.com" className="text-primary hover:underline">contact@plantsin.com</a></p>
            <p className="text-muted-foreground mb-2"><strong>Phone:</strong> +91 8240665500</p>
            <p className="text-muted-foreground"><strong>Address:</strong><br/>
            Plantsin<br/>
            Budge Budge, Kolkata,<br/>
            West Bengal, 700137<br/>
            India</p>
          </div>

          <h3>Business Hours</h3>
          <p>Our customer support team is available during the following hours:</p>
          <ul>
            <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (IST)</li>
            <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM (IST)</li>
            <li><strong>Sunday:</strong> Closed</li>
          </ul>

          <p>We aim to respond to all inquiries within 24 hours during regular business days.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
