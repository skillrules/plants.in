import { createServerFn } from '@tanstack/react-start';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { formatINR } from '@/lib/format';

// HTML-escape user-supplied values before interpolating into email templates.
// Prevents HTML/script injection and email-content spoofing.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ItemSchema = z.object({
  name: z.string().trim().min(1).max(200),
  qty: z.number().int().positive().max(1000),
  unitPrice: z.number().nonnegative().max(10_000_000),
  variant: z.string().trim().max(100).nullable().optional(),
});

const PayloadSchema = z.object({
  orderNumber: z.string().trim().min(3).max(64),
  customerName: z.string().trim().min(1).max(100),
  customerEmail: z.string().trim().email().max(200),
  shippingAddress: z.string().trim().min(1).max(500),
  shippingCity: z.string().trim().min(1).max(100),
  shippingPostal: z.string().trim().min(1).max(20),
  items: z.array(ItemSchema).min(1).max(100),
  subtotal: z.number().nonnegative().max(100_000_000),
  total: z.number().nonnegative().max(100_000_000),
});

export const sendOrderEmails = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    // 1. Validate input shape and length to prevent injection / abuse.
    const parsed = PayloadSchema.safeParse(ctx.data);
    if (!parsed.success) {
      console.warn("sendOrderEmails: invalid payload", parsed.error.flatten());
      return { success: false, error: "Invalid payload" };
    }
    const data = parsed.data;

    // 2. Resolve secrets from server-side env only. Never read VITE_* here —
    //    those are inlined into the client bundle and would leak.
    const processEnv = typeof process !== 'undefined' && process.env ? process.env : ({} as any);
    const cfEnv = ctx.context?.cloudflare?.env || ctx.context?.env || ({} as any);

    const RESEND_API_KEY = processEnv.RESEND_API_KEY || cfEnv.RESEND_API_KEY;
    const ADMIN_EMAIL = processEnv.ADMIN_EMAIL || cfEnv.ADMIN_EMAIL || 'admin@plantsin.com';
    const SUPABASE_URL = processEnv.SUPABASE_URL || cfEnv.SUPABASE_URL;
    const SUPABASE_KEY = processEnv.SUPABASE_PUBLISHABLE_KEY || cfEnv.SUPABASE_PUBLISHABLE_KEY;

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping emails.");
      return { success: false, error: "Resend API key missing" };
    }

    // 3. Verify the order exists in the DB before sending. This prevents
    //    arbitrary unauthenticated callers from using this endpoint as a
    //    spam relay — they'd have to first successfully insert an order
    //    (governed by the orders-table RLS policies).
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data: order, error: orderErr } = await sb
          .from('orders')
          .select('order_number, customer_email, created_at')
          .eq('order_number', data.orderNumber)
          .maybeSingle();
        if (orderErr || !order) {
          console.warn("sendOrderEmails: order not found", data.orderNumber);
          return { success: false, error: "Order not found" };
        }
        // Only allow sending shortly after the order was created (15 min window).
        const createdMs = order.created_at ? new Date(order.created_at as string).getTime() : 0;
        if (!createdMs || Date.now() - createdMs > 15 * 60 * 1000) {
          console.warn("sendOrderEmails: order outside send window", data.orderNumber);
          return { success: false, error: "Order outside send window" };
        }
        // Customer email in the request must match what was stored at checkout.
        if ((order.customer_email as string | null)?.toLowerCase() !== data.customerEmail.toLowerCase()) {
          console.warn("sendOrderEmails: email mismatch for", data.orderNumber);
          return { success: false, error: "Email mismatch" };
        }
      } catch (e: any) {
        console.error("sendOrderEmails: order verification failed", e?.message);
        return { success: false, error: "Order verification failed" };
      }
    } else {
      console.warn("sendOrderEmails: Supabase env missing, skipping order verification");
      return { success: false, error: "Server not configured" };
    }

    const resend = new Resend(RESEND_API_KEY);
    const adminEmail = ADMIN_EMAIL;
    const senderEmail = 'orders@plantsin.com';

    // 4. HTML-escape every interpolated, user-supplied field.
    const safe = {
      orderNumber: escapeHtml(data.orderNumber),
      customerName: escapeHtml(data.customerName),
      customerEmail: escapeHtml(data.customerEmail),
      shippingAddress: escapeHtml(data.shippingAddress),
      shippingCity: escapeHtml(data.shippingCity),
      shippingPostal: escapeHtml(data.shippingPostal),
    };

    const itemsHtml = data.items.map(i => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(i.name)}${i.variant ? ` (${escapeHtml(i.variant)})` : ''} x${i.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatINR(i.unitPrice * i.qty)}</td>
      </tr>
    `).join('');

    const customerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">Thank you for your order!</h1>
        <p>Hi ${safe.customerName},</p>
        <p>We've received your order <strong>${safe.orderNumber}</strong> and we're getting it ready for shipment.</p>
        
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
        ${safe.shippingAddress}, ${safe.shippingCity} ${safe.shippingPostal}</p>
        
        <p>Best regards,<br>The Plantsin Team</p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e63946;">New Order Received!</h1>
        <p><strong>Order Number:</strong> ${safe.orderNumber}</p>
        <p><strong>Customer:</strong> ${safe.customerName} (${safe.customerEmail})</p>
        <p><strong>Shipping To:</strong><br>
        ${safe.shippingAddress}<br>
        ${safe.shippingCity} ${safe.shippingPostal}</p>
        
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

      if (data.customerEmail && data.customerEmail !== "no-email@plantsin.com") {
        emailsToSend.push({
          from: `"Plantsin" <${senderEmail}>`,
          to: data.customerEmail,
          subject: `Your Plantsin Order Confirmation #${data.orderNumber}`,
          html: customerHtml,
        });
      }

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
