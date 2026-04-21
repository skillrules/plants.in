import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log("Testing Resend API with Key starting with:", process.env.RESEND_API_KEY?.substring(0, 5));
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'orders@plantsin.com',
      to: process.env.ADMIN_EMAIL || 'saiwebss@gmail.com',
      subject: 'Test Email from Resend',
      html: '<p>If you get this, Resend is working.</p>'
    });
    console.log("Response:", data, error);
  } catch (err) {
    console.error("Caught Error:", err);
  }
}
test();
