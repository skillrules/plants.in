import { createServerFn } from '@tanstack/react-start';
import * as nodemailer from 'nodemailer';
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

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP_USER or SMTP_PASS is not set. Skipping emails.");
      return { success: false, error: "SMTP credentials missing" };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@plantsin.com';
    const senderEmail = process.env.SMTP_USER; // Hostinger requires the sender to match the authenticated user

    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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
      // Send Admin Email
      await transporter.sendMail({
        from: `"Plantsin Orders" <${senderEmail}>`,
        to: adminEmail,
        subject: `New Order! ${data.orderNumber} - ${formatINR(data.total)}`,
        html: adminHtml,
      });

      // Send Customer Email
      if (data.customerEmail && data.customerEmail !== "no-email@plantsin.com") {
        await transporter.sendMail({
          from: `"Plantsin" <${senderEmail}>`,
          to: data.customerEmail,
          subject: `Your Plantsin Order Confirmation #${data.orderNumber}`,
          html: customerHtml,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error("Nodemailer send error:", error);
      return { success: false, error: error.message };
    }
  });
