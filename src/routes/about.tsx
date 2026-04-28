import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          About Plantsin
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p>Welcome to Plantsin! We believe that everyone deserves a vibrant, breathing space, and we are here to help you bring the outdoors in.</p>

          <h3>Our Story</h3>
          <p>It all started with a simple observation: we noticed a significant lack of high-quality, reliable online plant shops in India. Finding healthy, vibrant plants that actually survived the journey to our doorsteps felt much harder than it needed to be. Frustrated by the lack of options and poor delivery experiences, we decided to build the solution ourselves. That is how Plantsin was born.</p>

          <h3>Who We Are</h3>
          <p>Behind Plantsin is a tight-knit team of three friends bound by a profound love for the natural world. As passionate lovers of nature, animals, and birds, we have always found peace and joy in the environment around us. We built this store not just as a business, but as an extension of our own lifestyle, hoping to share that same connection to nature with you.</p>

          <h3>Our Mission</h3>
          <p>Our mission is simple: to make it easy for anyone to create their own indoor jungle. We know that plant care can sometimes feel intimidating, especially for beginners. That is why we are dedicated to not only delivering the absolute healthiest plants but also providing the education and resources you need to keep them thriving. Whether you are a seasoned gardener or buying your very first succulent, we are here to guide you every step of the way.</p>

          <h3>The Plantsin Difference</h3>
          <p>We know you have choices when it comes to buying plants. Here is what makes the Plantsin experience special:</p>
          <ul>
            <li><strong>Hand-Picked Plants:</strong> We treat every order as if it were going into our own homes. Every single plant is hand-picked for quality, health, and beauty before it leaves our nursery.</li>
            <li><strong>Originality &amp; Education:</strong> We don't just put a plant in a box; we set you up for success. We provide guaranteed original products alongside detailed, easy-to-follow care guides so you know exactly what your new green friend needs.</li>
            <li><strong>Secure Delivery Methods:</strong> Shipping living things requires expertise. We use highly secure, specialized packaging methods to ensure your plants arrive at your door safely, minimizing transit shock so they are ready to thrive in their new home.</li>
          </ul>

          <p className="mt-8 font-medium italic">Thank you for letting us be a part of your plant journey. Let's grow something beautiful together!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
