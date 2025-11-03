import emailjs from "emailjs-com";

export const sendEmail = async (templateParams: Record<string, any>) => {
  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
    );
    console.log("Email sent successfully:", result.text);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
