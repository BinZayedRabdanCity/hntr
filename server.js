// server.js
// Node (Express) server to receive /log-visit and forward to Discord webhook securely.
// Usage:
// 1) create a .env file with DISCORD_WEBHOOK_URL set (see .env.example)
// 2) npm init -y && npm i express dotenv
// 3) node server.js

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!webhookUrl) {
  console.warn('DISCORD_WEBHOOK_URL not set. Server will accept /log-visit but will only log to console.');
}

app.post('/log-visit', async (req, res) => {
  const { ip, dateTime, userAgent } = req.body || {};
  const content = `📥 New Visitor Logged\n\n🌐 IP: ${ip || 'unknown'}\n🕒 Time: ${dateTime || new Date().toLocaleString()}\n🖥️ UA: ${userAgent || 'unknown'}`;

  try {
    if (!webhookUrl) {
      console.log('Received visit (no webhook configured):', { ip, dateTime, userAgent });
      return res.sendStatus(204);
    }

    // Node 18+ يوفر fetch مضمّنًا؛ إذا كان لديك Node أقدم، استبدل fetch بنود-فيتش
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (!r.ok) {
      console.error('Discord webhook responded with', r.status);
      return res.status(502).send('Webhook error');
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));