require("dotenv").config();
const nodemailer = require("nodemailer");

// Send emails to multiple users
class SendBulkMail {
  constructor(userInput) {
    const { email, subject, content, cc, attachments } = userInput;
    if (!email || !subject || !content) {
      throw new Error("Email, subject and content are required.");
    }
    this.emails = Array.isArray(email) ? email : email.split(",");
    this.cc = cc ? (Array.isArray(cc) ? cc : cc.split(",")) : [];
    this.subject = subject;
    this.content = content;
    this.attachments = attachments || [];
  }
  // Connecting with gmail with credentials
  async sendMail() {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    // Create return object template
    const result = { success: [], invalidEmail: [] };
    // For loop for sending same email content to multiple users
    for (let i = 0; i < this.emails.length; i++) {
      const email = this.emails[i];
      if (this.isValidEmail(email)) {
        const mailOptions = {
          from: `Test Mail - Nodejs App <${process.env.GMAIL_USERNAME}>`,
          to: email,
          cc: this.cc,
          subject: this.subject,
          html: this.content,
          attachments: this.attachments,
        };
        try {
          const sentEmail = await transporter.sendMail(mailOptions);
          result.success.push({ email, messageId: sentEmail.messageId });
        } catch (error) {
          console.error(`Bulk Email Error - ${error}`);
        }
      } else {
        result.invalidEmail.push(email);
      }
    }
    return result;
  }
  // Email format check
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}

module.exports = SendBulkMail;
