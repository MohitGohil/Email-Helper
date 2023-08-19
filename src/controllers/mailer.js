const Mailer = require("../../services/mailService");
const SendBulkMail = require("../../services/bulkMailService");

async function homeRoute(req, res) {
  return res.status(200).json({
    message: "Hi, This is email helper. You can send customized email in bulk.",
    routes: "visit /help route for guide.",
  });
}

async function helpRoute(req, res) {
  return res.status(200).json({
    message: "Visit /single to send single email and /multiple for bulk email",
    testEmailParams: "Visit /test route and enter email to receive test email.",
    singleEmailParams: {
      emails: "Enter email separated with commas or enter array of email",
      cc: "Enter email separated with commas or enter array of email",
      subject: "Subject type should be string",
      content: "Content with text or html",
      attachments: "This feature is in development stage!",
    },
    bulkEmailParams: {
      emails: "Enter email separated with commas or enter array of email",
      cc: "Enter email separated with commas or enter array of email",
      subject: "Subject type should be string",
      content: "Content with text or html",
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
      content: `Hi,<br><p>This is test email</b>.<br><br>Please ignore if it's not you.`,
    };
    try {
      const { messageId, accepted, rejected } = await new Mailer(emailTemplate).sendMail();
      console.log({ messageId, accepted, rejected });
      return res.status(200).json({ message: `Mail sent to ${email}` });
    } catch (err) {
      console.log("Test email err - ", err);
    }
  }
  return res.status(200).json({ message: "Enter email in req params to receive test email." });
}

async function singleEmailHandler(req, res) {
  return res.status(200).json({ message: "Hello from getHandler" });
}

async function multipleEmailHandler(req, res) {
  return res.status(200).json({ message: "Hello from getHandler" });
}

module.exports = { homeRoute, helpRoute, testRoute, singleEmailHandler, multipleEmailHandler };
