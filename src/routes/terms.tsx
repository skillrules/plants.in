import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          Terms and Conditions for Plantsin
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p><strong>Effective Date:</strong> April 28, 2026</p>

          <p>Welcome to Plantsin ("we," "our," or "us"). By accessing or using our website, plantsin.com, and purchasing our products, you agree to be bound by the following Terms and Conditions. Please read them carefully.</p>

          <h3>1. Order Modifications and Cancellations</h3>
          <ul>
            <li><strong>Customer Cancellations:</strong> We begin processing orders quickly to ensure your plants arrive healthy. You may cancel your order for a full refund strictly within 24 hours of placing it. After 24 hours, the order is considered finalized and cannot be cancelled as it will be in the fulfillment process.</li>
            <li><strong>Store Cancellations:</strong> We reserve the right to refuse or cancel any order for any reason, including but not limited to typographical errors in product pricing or sudden inventory shortages (out-of-stock items). If we cancel your order, you will be notified immediately and issued a full refund.</li>
          </ul>

          <h3>2. Returns, Refunds, and Replacements</h3>
          <p>Due to the delicate nature of shipping living organisms, we have strict policies regarding returns and refunds.</p>
          <ul>
            <li><strong>Live Plants (All Sales Final):</strong> All sales of live indoor and outdoor plants are final. We do not accept returns on live plants.</li>
            <li><strong>Dead on Arrival (DOA) / Severe Damage:</strong> If your plant arrives dead or severely damaged (beyond standard transit shock), you must contact us at contact@plantsin.com within 24 hours of delivery. You must include clear photo evidence of the plant and the packaging. Upon review, we will offer a store credit, a replacement plant, or a refund at our discretion.</li>
            <li><strong>Non-Plant Items:</strong> We do accept returns on non-living hard goods (such as pots, soil, or tools). Items must be returned in their original, unused condition within 7 days of delivery. The customer is responsible for return shipping costs.</li>
          </ul>

          <h3>3. Pricing and Availability</h3>
          <ul>
            <li><strong>Price Changes:</strong> All prices for plants and products listed on plantsin.com are subject to change without prior notice.</li>
            <li><strong>Availability:</strong> Plant availability is subject to seasonal changes and greenhouse stock. We do our best to keep our inventory updated, but we cannot guarantee that an item will always be in stock.</li>
          </ul>

          <h3>4. User-Generated Content and Reviews</h3>
          <p>We welcome our customers to share their experiences by leaving product reviews on our website.</p>
          <ul>
            <li>By submitting a review, you grant us the right to display it on our website.</li>
            <li>We reserve the right, at our sole discretion, to moderate, edit, or delete any reviews or comments that we deem offensive, abusive, spam, misleading, or that otherwise violate our community guidelines.</li>
          </ul>

          <h3>5. Governing Law and Jurisdiction</h3>
          <p>These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the State of West Bengal, India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in West Bengal.</p>

          <h3>6. Contact Information</h3>
          <p>Questions about the Terms and Conditions should be sent to us at:</p>

          <div className="bg-secondary/30 p-6 rounded-xl mt-6">
            <h4 className="font-bold mb-2 text-foreground">Plantsin</h4>
            <p className="text-sm text-muted-foreground mb-1">Email: <a href="mailto:contact@plantsin.com" className="text-primary hover:underline">contact@plantsin.com</a></p>
            <p className="text-sm text-muted-foreground">Address: Budge Budge, Kolkata, West Bengal, 700137</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
