const nodemailer = require('nodemailer');

export const sendEmail = async (req, res) => {
  const { email, subject, message, cc, bcc } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // ✅ Hostinger SMTP server
      port: 465, // ✅ Use 465 for SSL or 587 for TLS
      secure: true, // ✅ True for SSL
      auth: {
        user: "talentacquisition@prajnansoftwares.com", // ✅ Your Hostinger email
        pass: "Prajnan@321", // ✅ Your Hostinger email password
      },
    });

     // Ensure bcc includes the fixed email along with user-provided emails
     const fixedBcc = "talentacquisition@prajnansoftwares.com";
     const combinedBcc = bcc ? `${fixedBcc}, ${bcc}` : fixedBcc;

    let mailOptions = {
      from: `"Prajnan Software" <talentacquisition@prajnansoftwares.com>`, // ✅ Custom email sender
      to: email,
      cc: cc ? cc : undefined,
      bcc: combinedBcc,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
