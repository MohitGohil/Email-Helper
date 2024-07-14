// import Mailer from "../services/mailService";
import SendBulkMail from "../services/bulkMailService.js";

async function homeRoute(req, res) {
  return res.status(200).json({
    message: "Hi, This is email helper. You can send customized email in bulk.",
    routes: "visit /email/help route for guide.",
  });
}

async function helpRoute(req, res) {
  return res.status(200).json({
    message: "Authorized user can POST request on home route to send email.  of emails for bulk.",
    testEmailParams: "Visit /test?email=demo@gmail.com route to check test email.",
    singleEmailParams: {
      email: "Enter email address in string to send email to single user",
      cc: "Enter email separated with commas or enter array of email",
      subject: "Subject type should be string",
      content: "Content with TEXT or HTML",
      attachments: "This feature is in development stage!",
    },
    bulkEmailParams: {
      email: "Enter array of emails to send email to multiple users",
      cc: "Enter email with commas or array of email.(Note - All users will have same cc members)",
      subject: "Subject type should be string",
      content: "Content with TEXT or HTML",
      attachments: "This feature is in development stage!",
    },
  });
}

async function testRoute(req, res) {
  const { email } = req.query;
  if (email) {
    const emailTemplate = {
      email: email,
      subject: "Test email",
      content: `Hi,<br><p>This is test email</b>.<br><br>Please ignore.`,
    };
    try {
      await new SendBulkMail(emailTemplate).sendMail();
      return res.status(200).json({ message: `Mail sent to ${email}` });
    } catch (err) {
      console.log("Test email err - ", err);
    }
  }
  return res.status(200).json({ message: "Enter email in req params to receive test email." });
}

async function emailHandler(req, res) {
  const { email, subject, content } = req.body;
  if (!email || !subject || !content) {
    return res.status(400).json({ message: "Email, subject and content are required." });
  }
  try {
    const result = await new SendBulkMail(req.body).sendMail();
    return res.status(200).json({ message: "Request processed successfully", result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong while sending email!" });
  }
}

export { homeRoute, helpRoute, testRoute, emailHandler };
