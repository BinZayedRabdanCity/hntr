// visitor-logger-direct.js
// Client-side direct webhook sender (UNSAFE — for local testing only).
// WARNING: This file contains a Discord webhook URL and will expose it to anyone
// who opens the page. Use only for short local tests and NEVER deploy publicly.

(async function logVisitorDirect(){
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const ip = data.ip;
    const country = data.country_name;
    const city = data.city;
    const dateTime = new Date().toLocaleString();
    const webhookUrl = 'https://discord.com/api/webhooks/1403014859779735572/XEyqkH1Qvh-VuUeQFC05LzR5WjITzz2JM3tAPq-KtHhWGdBItFSzsIBjXYDczuJsCX3_';

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        content: `📥 New Visitor Logged\n\n🌐 IP: ${ip}\n🏙️ Country/City: ${country} - ${city}\n🕒 Time: ${dateTime}`
      })
    });

    console.log('Webhook sent (direct)');
  } catch (err) {
    console.error('Failed to send webhook:', err);
  }
})();