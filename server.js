// server.js
// Node (Express) server to receive /log-visit and forward to Discord webhook securely.
// Usage:
// 1) create a .env file with DISCORD_WEBHOOK_URL set (see .env.example)
// 2) npm init -y && npm i express dotenv
// 3) node server.js

import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// If running on Node < 18, try to polyfill fetch using node-fetch (optional dependency)
(async function init() {
  if (typeof fetch === 'undefined') {
    try {
      const { default: fetchFn } = await import('node-fetch');
      globalThis.fetch = fetchFn;
      console.log('Polyfilled global fetch using node-fetch');
    } catch (e) {
      console.warn('node-fetch not available; fetch may be missing on this Node version. Install `node-fetch` if needed.');
    }
  }

  const app = express();
  app.use(express.json());

  // Serve static files from the project root so test pages are accessible at http://localhost:PORT/
  app.use(express.static(process.cwd()));

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL not set. Server will accept /log-visit but will only log to console.');
  }

  app.post('/log-visit', async (req, res) => {
    const { ip, dateTime, userAgent } = req.body || {};
    console.log('Incoming /log-visit request:', req.body);

    const content = `📥 New Visitor Logged\n\n🌐 IP: ${ip || 'unknown'}\n🕒 Time: ${dateTime || new Date().toLocaleString()}\n🖥️ UA: ${userAgent || 'unknown'}`;

    try {
      if (!webhookUrl) {
        console.log('Received visit (no webhook configured):', { ip, dateTime, userAgent });
        return res.sendStatus(204);
      }

      const r = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!r.ok) {
        const bodyText = await r.text().catch(() => '<no body>');
        console.error('Discord webhook responded with', r.status, bodyText);
        return res.status(502).send('Webhook error');
      }

      console.log('Webhook forwarded successfully');
      res.sendStatus(204);
    } catch (err) {
      console.error('Error forwarding webhook:', err);
      res.status(500).send('Server error');
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
})();
