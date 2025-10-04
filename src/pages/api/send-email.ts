import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

console.log("✅ API loaded: /api/send-email is ready");

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log("Email user:", import.meta.env.ASTRO_EMAIL_USER);
    console.log("Email pass exists:", !!import.meta.env.ASTRO_EMAIL_PASS);

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.ASTRO_EMAIL_USER,
        pass: import.meta.env.ASTRO_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
    from: `"${name} (${email})" <${import.meta.env.ASTRO_EMAIL_USER}>`,
    replyTo: email,
    to: import.meta.env.ASTRO_EMAIL_USER,
    subject: `📬 New Email from your portfolio Name : ${name}`,
    html: `
      <h2>New message from your portfolio contact form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      <hr />
      <p style="font-size: 12px; color: gray;">This message was sent from your portfolio website form.</p>
    `,
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (err) {
    console.error("Email sending error:", err);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), { status: 500 });
  }
};
