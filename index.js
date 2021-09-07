require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.SECRET_KEY);
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.set("PORT", process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  const { amount } = req.body;
  try {
    await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method_types: ["card"],
    });

    return res.status(200).json({ status: 200 });
  } catch (error) {
    return res.json({ message: error.raw?.message || "error", status: 400 });
  }
});

app.post("/send", (req, res) => {
  const { email } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "patsiashnossa0@gmail.com",
    subject: "La Venus Patsias Hnos. S.a.",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>Le agradecemos su preferencia en nuestros productos de calidad, cualquier duda o inconveniente háganoslo saber por este medio.</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return res.json({ message: "successful" });
    })
    .catch((error) => {
      console.error(error.message);
      return res.json({ message: "error" });
    });
});

app.listen(app.get("PORT"), () => {
  console.log("Server on port", app.get("PORT"));
});
