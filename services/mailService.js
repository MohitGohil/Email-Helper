const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

class Mailer {
  constructor(userInput) {
    const { email, subject, content, cc, attachments } = userInput;
    if (!email || !subject || !content) {
      throw new Error("Email, subject and content are required.");
    }
    // User input fields
    this.emails = Array.isArray(email) ? email : email.split(",");
    this.cc = cc ? (Array.isArray(cc) ? cc : cc.split(",")) : [];
    this.subject = subject;
    this.content = content;
    this.attachments = attachments || [];
    // Fields required to send mail
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.redirectUri = process.env.REDIRECT_URI || "https://developers.google.com/oauthplayground";
    this.refreshToken = process.env.REFRESH_TOKEN;
    this.gmailAppPass = process.env.GMAIL_APP_PASS;
    // Generate refresh token
    this.oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
    this.oAuth2Client.setCredentials({ refresh_token: this.refreshToken });
    // OAuth2 Config
    this.transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: `${process.env.GMAIL_USERNAME}`,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken,
        accessToken: this.oAuth2Client.getAccessToken(),
      },
    });
  }

  async sendMail() {
    // Remove invalid emails from the array
    const receiversEmail = this.emails;
    for (let i = 0; i < receiversEmail.length; i++) {
      const email = receiversEmail[i];
      if (!this.#isValidEmail(email)) {
        receiversEmail.pop(email);
      }
    }
    // Generate email template
    const mailOptions = {
      from: `Test Mail - Nodejs App <${process.env.GMAIL_USERNAME}>`,
      to: receiversEmail.join(","),
      cc: this.cc.join(","),
      subject: this.subject,
      html: this.content,
      attachments: this.attachments,
    };
    // sending email to users
    try {
      const sentEmailResult = await this.transport.sendMail(mailOptions);
      return sentEmailResult;
    } catch (err) {
      console.log("Error - Mailer.sendMail", err);
      throw new Error(err);
    }
  }
  // check email format
  #isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}

module.exports = Mailer;
