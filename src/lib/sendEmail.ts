import emailjs from "emailjs-com";

interface TemplateParams {
  to_email: string;
  parent_name: string;
  doctor_name: string;
  child_name: string;
  vaccination: string;
  appointment_date: string;
  appointment_time: string;
  [key: string]: string; // allow extra fields if needed
}

export const sendEmail = async (templateParams: TemplateParams) => {
  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string,
    );
    console.log("Email sent successfully:", result.text);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
