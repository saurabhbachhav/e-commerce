import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }
  
  const { email, subject, message } = req.body;
     // console.log("-------------------#####----");
     // console.log(email.email);
     // console.log(process.env.EMAIL_USER);
     // console.log(process.env.EMAIL_PASS);
  // Validate required fields
  if (!email || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Missing required fields: email, subject, or message." });
  }

  try {
    // Create a transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Spargen" <${process.env.EMAIL_USER}>`, // Sender's name and email
      to: email.email, // Recipient email address
      subject: subject, // Email subject
      text: message, // Email plain text content
    });

    // Respond with success message
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.message || error);

    // Respond with error message
    return res.status(500).json({
      error: "Failed to send email. Please check the server logs for details.",
    });
  }
}
