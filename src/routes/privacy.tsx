import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  component: StaticPage,
});

function StaticPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-deep mb-8 border-b border-border/60 pb-6">
          Privacy Policy for Plantsin
        </h1>
        <div className="text-foreground/90 text-base leading-relaxed [&_p]:mb-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-foreground">
          <p><strong>Effective Date:</strong> April 28, 2026</p>

          <p>Welcome to Plantsin ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us through our website, plantsin.com. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our site or make a purchase.</p>

          <h3>1. Information We Collect</h3>
          <p>We collect the minimum amount of information necessary to fulfill your orders and provide a smooth shopping experience.</p>
          <ul>
            <li><strong>Personal Information:</strong> When you make a purchase—either by creating an account or using guest checkout—we collect your name, email address, phone number, billing address, and shipping address.</li>
            <li><strong>Analytics and Usage Data:</strong> We collect basic, non-identifiable usage data to track our monthly visitor count. This helps us understand our website traffic and improve our store.</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect strictly for operational and business purposes, including:</p>
          <ul>
            <li>Processing, fulfilling, and shipping your indoor and outdoor plant orders.</li>
            <li>Communicating with you regarding your order status, shipping updates, or customer support inquiries.</li>
            <li>Allowing you to create and manage a customer account.</li>
            <li>Future marketing communications (e.g., newsletters or promotions). <em>Note: If we introduce marketing emails in the future, you will always have the option to easily opt out or unsubscribe.</em></li>
          </ul>

          <h3>3. How We Share Your Information</h3>
          <p>We do not sell, trade, or rent your personal information to third parties. We only share your data with trusted service providers necessary to operate our business:</p>
          <ul>
            <li><strong>Payment Processors:</strong> We use Razorpay and Stripe to process transactions securely. We do not store your credit card numbers or sensitive payment details on our servers; this information is handled directly and securely by our payment gateways.</li>
            <li><strong>Shipping &amp; Logistics:</strong> We share your name, phone number, and shipping address with our courier partners solely for the purpose of delivering your plants.</li>
          </ul>

          <h3>4. Cookies and Tracking</h3>
          <p>Our website uses essential cookies to maintain site functionality, such as keeping items in your shopping cart and remembering your session if you log in. We also use minimal tracking cookies strictly for counting monthly site visitors.</p>

          <h3>5. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We utilize secure hosting environments to ensure your data is stored safely.</p>

          <h3>6. Your Rights</h3>
          <p>If you have created an account with us, you can log in at any time to review, update, or correct your personal information. You may also contact us to request the deletion of your account or personal data from our systems.</p>

          <h3>7. Jurisdiction</h3>
          <p>Plantsin currently ships exclusively within India. By using our website, you understand that your information is processed in accordance with applicable Indian laws.</p>

          <h3>8. Changes to This Privacy Policy</h3>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational or legal reasons. Any updates will be posted on this page with a revised "Effective Date."</p>

          <h3>9. Contact Us</h3>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to us at:</p>

          <div className="bg-secondary/30 p-6 rounded-xl mt-6 not-prose">
            <h4 className="font-bold mb-2">Plantsin</h4>
            <p className="text-sm text-muted-foreground mb-1">Email: <a href="mailto:contact@plantsin.com" className="text-primary hover:underline">contact@plantsin.com</a></p>
            <p className="text-sm text-muted-foreground">Address: Budge Budge, Kolkata, West Bengal, 700137</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
