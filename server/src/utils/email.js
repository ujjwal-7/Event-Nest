const nodemailer = require("nodemailer");
const { serverConfig } = require("../config/index");

const sendEmail = (email, mailDetails) => {

  const mailOptions = {
        from: serverConfig.EMAIL,
        to: email,
        subject: "Event Booking Confirmation",
        text: `We are pleased to confirm your booking. Below are the details of your booking:
            
            Event Name: ${mailDetails.eventName}
            Number of Tickets: ${mailDetails.quantity}
            Total Amount Paid: ${mailDetails.totalCost}
            Order ID: ${mailDetails.orderId}
            If you have any questions or need further assistance, please don't hesitate to reach out. We look forward to welcoming you to the event!

            Thank you for your booking!`
    };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: serverConfig.EMAIL,
      pass: serverConfig.PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Send " + info.response);
    }
  });
};

module.exports = sendEmail;