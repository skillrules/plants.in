import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/return-refund")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          Return and Refund Policy for Plantsin
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p><strong>Effective Date:</strong> April 28, 2026</p>

          <p>At Plantsin, we want you to be thrilled with your new green additions. Because shipping living plants involves unique challenges, we have specific guidelines in place to ensure a fair process for our customers. Please read our policy carefully before making a purchase.</p>

          <h3>1. Order Cancellations</h3>
          <p>We process orders quickly to ensure your plants are packed and shipped in optimal health.</p>
          <ul>
            <li>You may cancel your order for a full refund strictly within 24 hours of placing it.</li>
            <li>After 24 hours, the order is considered finalized and cannot be cancelled, as it will already be in our fulfillment process.</li>
          </ul>

          <h3>2. Live Plants Policy</h3>
          <ul>
            <li><strong>All Sales Final:</strong> Due to the delicate nature of living organisms, all sales on live indoor and outdoor plants are final. We do not accept standard returns on live plants.</li>
            <li><strong>Transit Shock:</strong> It is completely normal for a plant to experience minor transit shock (such as a few yellowing or dropped leaves, or slight drooping) after spending time in a dark shipping box. This is not considered a defect. With proper light and water, your plant will bounce back.</li>
            <li><strong>Dead on Arrival (DOA) / Severe Damage:</strong> If your plant arrives dead or severely damaged beyond normal transit shock, we are here to make it right. You must email us at contact@plantsin.com within 24 hours of delivery. Please include your order number and clear photographs of both the damaged plant and the packaging. Upon review, we will offer a replacement plant, a store credit, or a refund.</li>
          </ul>

          <h3>3. Non-Plant Items (Pots, Tools, Soil)</h3>
          <p>We accept returns and exchanges on non-living hard goods within 7 days of the delivery date.</p>
          <ul>
            <li>Items must be returned in their original, unused condition and in their original packaging.</li>
            <li><strong>Return Shipping:</strong> The customer is responsible for paying the return shipping costs for non-plant items.</li>
            <li><strong>How to Initiate a Return:</strong> To start a return, please email us at contact@plantsin.com with your order number to receive a Return Authorization.</li>
          </ul>

          <h3>4. Exchanges (Non-Plant Items)</h3>
          <p>If you receive a defective or broken non-plant item (such as a shattered pot), we offer two options:</p>
          <ul>
            <li><strong>Direct Exchange:</strong> We can swap the broken item for a new one.</li>
            <li><strong>Refund:</strong> We can issue a refund for the item, allowing you to place a new order at your convenience.</li>
          </ul>

          <h3>5. Return Address</h3>
          <p>Once you have received a Return Authorization from our support team via email, please ship your approved non-plant returns to our standard facility:</p>
          <div className="bg-secondary/30 p-6 rounded-xl my-6">
            <h4 className="font-bold mb-2 text-foreground">Plantsin Returns</h4>
            <p className="text-sm text-muted-foreground">Budge Budge, Kolkata,</p>
            <p className="text-sm text-muted-foreground">West Bengal, 700137</p>
            <p className="text-sm text-muted-foreground">India</p>
          </div>

          <h3>6. Refund Timeline</h3>
          <ul>
            <li>Once your return is received and inspected at our facility, or once a DOA plant refund is approved, we will process your refund.</li>
            <li>The funds will automatically be applied to your original method of payment (via Razorpay or Stripe).</li>
            <li>Please allow 5 to 7 business days for the refund to fully reflect in your bank account or credit card statement, depending on your financial institution's processing times.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
