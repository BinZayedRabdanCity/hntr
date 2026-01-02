// visitor-logger.js
// Client-side: يجلب الـ IP ثم يرسل البيانات إلى endpoint محلي (/log-visit)
// ملاحظة أمنيّة: لا تضَع رابط الـ Discord webhook داخل هذا الملف؛ اجعل الإرسال يتم من الخادم.

async function logVisitor() {
  const statusEl = document.getElementById('status');
  try {
    statusEl && (statusEl.textContent = 'جاري جلب معلومات الزائر...');

    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    const ip = data.ip;
    const dateTime = new Date().toLocaleString();
    const payload = { ip, dateTime, userAgent: navigator.userAgent };

    // أرسل إلى سيرفرك الخاص: POST /log-visit
    const r = await fetch('/log-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      statusEl && (statusEl.textContent = `الخادم رد بحالة ${r.status}`);
      console.warn('Server responded with', r.status, await r.text());
    } else {
      statusEl && (statusEl.textContent = 'تم الإرسال بنجاح (تحقق من الخادم أو Discord)');
      console.log('Visit logged:', payload);
    }
  } catch (err) {
    console.error(err);
    statusEl && (statusEl.textContent = 'حدث خطأ. افتح الكونسول للاطلاع على التفاصيل.');
  }
}

// ربط الزر إذا وُجد
const btn = document.getElementById('logBtn');
if (btn) btn.addEventListener('click', logVisitor);

// خيار: يمكنك استدعاء logVisitor() مباشرة عند تحميل الصفحة إذا أردت اختبارًا تلقائيًا
// window.addEventListener('load', logVisitor);