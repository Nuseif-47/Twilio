const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifyServiceSid = process.env.VERIFY_SERVICE_SID;

app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: 'sms' });
    res.send({ status: verification.status });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const check = await client.verify
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });
    res.send({ success: check.status === 'approved' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
