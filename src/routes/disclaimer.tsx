import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/disclaimer")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          Disclaimer for Plantsin
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p><strong>Effective Date:</strong> April 28, 2026</p>

          <p>The information provided by Plantsin ("we," "our," or "us") on plantsin.com (the "Website") is for general informational and shopping purposes only. By purchasing from our Website, you agree to the following terms regarding our living products.</p>

          <h3>1. Plant Appearance</h3>
          <p>Plants are living organisms, and as such, each one is unique. The photographs on our Website are intended to represent the species and general appearance of the plant you will receive. However, the actual plant delivered may vary slightly in size, shape, color, leaf count, and variegation from the images shown.</p>

          <h3>2. Plant Health, Toxicity, and Safety</h3>
          <p>Many indoor and outdoor plants can be toxic if ingested and may cause allergic reactions.</p>
          <ul>
            <li><strong>Toxicity Warning:</strong> Some plants sold on our Website may be harmful or fatal to pets (dogs, cats, birds, etc.) and humans (especially young children) if chewed or consumed.</li>
            <li><strong>Customer Responsibility:</strong> It is your sole responsibility to research the toxicity of any plant before purchasing and to ensure it is kept out of reach of children and pets. Plantsin is not liable for any illness, injury, or veterinary/medical expenses resulting from the ingestion of or contact with our plants.</li>
          </ul>

          <h3>3. Plant Care and Survival</h3>
          <p>We take great pride in shipping healthy, robust plants. However, once a plant is delivered to your shipping address, you are solely responsible for its ongoing care and survival. * We do not offer guarantees on the lifespan of the plants after delivery.</p>
          <p>We are not liable for plants that decline or die due to improper care, including but not limited to: overwatering, underwatering, insufficient or excessive light, improper soil or repotting, extreme temperatures, or pest infestations that occur after the plant has arrived.</p>

          <h3>4. Shipping and Transit Shock</h3>
          <p>Shipping a living plant in a dark box can cause temporary stress. It is completely normal for a plant to experience minor transit shock.</p>
          <ul>
            <li><strong>Symptoms of transit shock</strong> may include a few yellowing or dropping leaves, slight drooping, or minor cosmetic damage.</li>
            <li><strong>Not a Defect:</strong> These occurrences are normal and are not considered a defect or a reason for a refund. With proper acclimatization, water, and light, your plant should recover and thrive within a few days to a few weeks.</li>
          </ul>

          <h3>5. General Website Disclaimer</h3>
          <p>All content on this Website is provided in good faith. We make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or plant care tips on the Site.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
