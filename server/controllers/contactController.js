const nodemailer = require('nodemailer');

const contactController = {
  // Send contact form message
  sendMessage: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Create email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Email content
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <h3>New Contact Form Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error('Contact Form Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending message',
        error: error.message
      });
    }
  }
};

module.exports = contactController; 