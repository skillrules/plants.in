import { createServerFn } from '@tanstack/react-start';
import { Resend } from 'resend';
import { formatINR } from '@/lib/format';

export const sendOrderEmails = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data as {
      orderNumber: string;
      customerName: string;
      customerEmail: string;
      shippingAddress: string;
      shippingCity: string;
      shippingPostal: string;
      items: Array<{ name: string; qty: number; unitPrice: number; variant?: string | null }>;
      subtotal: number;
      total: number;
    };

    // Fallback to various ways TanStack Start/Cloudflare might expose env variables
    const processEnv = typeof process !== 'undefined' && process.env ? process.env : ({} as any);
    const cfEnv = ctx.context?.cloudflare?.env || ctx.context?.env || ({} as any);
    
    // Statically replaced by Vite during build, fallback to runtime envs
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || processEnv.RESEND_API_KEY || cfEnv.RESEND_API_KEY;
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || processEnv.ADMIN_EMAIL || cfEnv.ADMIN_EMAIL || 'admin@plantsin.com';

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping emails.");
      return { success: false, error: "Resend API key missing" };
    }

    const resend = new Resend(RESEND_API_KEY);
    const adminEmail = ADMIN_EMAIL;
    // Resend will throw an error if this domain isn't verified in your Resend account!
    // If it's not verified yet, you must use 'onboarding@resend.dev'
    const senderEmail = 'orders@plantsin.com'; 

    const itemsHtml = data.items.map(i => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.name} ${i.variant ? `(${i.variant})` : ''} x${i.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatINR(i.unitPrice * i.qty)}</td>
      </tr>
    `).join('');

    const customerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">Thank you for your order!</h1>
        <p>Hi ${data.customerName},</p>
        <p>We've received your order <strong>${data.orderNumber}</strong> and we're getting it ready for shipment.</p>
        
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 8px; font-weight: bold;">Subtotal</td>
            <td style="padding: 8px; text-align: right;">${formatINR(data.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #1a4d2e;">${formatINR(data.total)}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">We'll notify you when it ships to:<br>
        ${data.shippingAddress}, ${data.shippingCity} ${data.shippingPostal}</p>
        
        <p>Best regards,<br>The Plantsin Team</p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e63946;">New Order Received!</h1>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Shipping To:</strong><br>
        ${data.shippingAddress}<br>
        ${data.shippingCity} ${data.shippingPostal}</p>
        
        <h3>Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">${formatINR(data.total)}</td>
          </tr>
        </table>
      </div>
    `;

    try {
      const emailsToSend = [
        {
          from: `"Plantsin Orders" <${senderEmail}>`,
          to: adminEmail,
          subject: `New Order! ${data.orderNumber} - ${formatINR(data.total)}`,
          html: adminHtml,
        }
      ];

      // Add customer email if they provided one
      if (data.customerEmail && data.customerEmail !== "no-email@plantsin.com") {
        emailsToSend.push({
          from: `"Plantsin" <${senderEmail}>`,
          to: data.customerEmail,
          subject: `Your Plantsin Order Confirmation #${data.orderNumber}`,
          html: customerHtml,
        });
      }

      // Send emails in a batch
      const { data: resendData, error } = await resend.batch.send(emailsToSend);

      if (error) {
        console.error("Resend API Error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: resendData };
    } catch (error: any) {
      console.error("Resend send error:", error);
      return { success: false, error: error.message };
    }
  });
