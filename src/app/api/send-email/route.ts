// app/api/send-email/route.ts
import { Resend } from "resend";

// 🔑 Safely get API key — will be undefined if missing
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("❌ RESEND_API_KEY is missing in .env");
}

const resend = new Resend(apiKey);

export async function POST(request: Request) {
  try {
    // 📥 Parse incoming JSON
    const body = await request.json();
    const {
      to,
      parentName = "Parent",
      childName,
      vaccination = "Vaccination",
      appointmentDate = "Not specified",
      appointmentTime = "Not specified",
      doctorName = "Doctor",
    } = body;

    // ✅ Validate minimal requirement: recipient email
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "to" email' }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // ✉️ Send email using Resend’s sandbox domain (no domain needed!)
    const { data, error } = await resend.emails.send({
      from: "Vaccine Tracker <onboarding@resend.dev>", // ✅ FREE & VERIFIED
      to: [to.trim()],
      subject: `💉 Appointment Scheduled for ${childName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #fafafa;">
          <h2 style="color: #2563eb;">Hello ${parentName},</h2>
          <p>An appointment has been scheduled for your child:</p>
          <div style="background: white; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 8px 0;">${childName}</h3>
            <p style="margin: 4px 0;"><strong>Vaccine:</strong> ${vaccination}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${appointmentDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${appointmentTime}</p>
            <p style="margin: 4px 0;"><strong>Doctor:</strong> ${doctorName}</p>
          </div>
          <p>Thank you for using <strong>Vaccine Tracker</strong>.</p>
          <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated message. Do not reply.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("📧 Resend API Error:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Unknown Resend error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`✅ Email sent to ${to}. Resend ID:`, data.id);
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // `err` is `unknown` — safely narrow it
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : err && typeof err === "object" && "message" in err
            ? String((err as { message?: unknown }).message)
            : "Internal server error";

    console.error("💥 Route Handler Error:", err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
