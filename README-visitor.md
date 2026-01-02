ملفات الاختبار لالتقاط زيارات الموقع

ملفان مهمان:
- `test-visitor.html` - صفحة اختبار يمكن فتحها محليًا وتتضمن زرًا لإرسال بيانات الزائر.
- `visitor-logger.js` - كود الواجهة الذي يجلب IP ثم يرسل POST إلى `/log-visit`.
- `server.js` - سيرفر Node بسيط (Express) يستقبل `/log-visit` ويُعيد توجيه الرسالة إلى Discord webhook بطريقة آمنة (يستخدم متغير البيئة `DISCORD_WEBHOOK_URL`).

تشغيل السيرفر محليًا:
1. انسخ `.env.example` إلى `.env` وضع رابط webhook الخاص بك في `DISCORD_WEBHOOK_URL`.
2. تثبيت الحزم: `npm init -y && npm i express dotenv`
3. تشغيل السيرفر: `node server.js`
4. افتح `test-visitor.html` في المتصفح (يفضل بدون redirect) واضغط "سجل زيارة".

ملاحظات أمنيّة:
- لا تقم بوضع `DISCORD_WEBHOOK_URL` في كود الواجهة (متصفح). احتفظ به سرّيًا في الخادم.
- إذا كان webhook الحالي منشورًا علنًا، قم بتدويره (revoke & recreate) فورًا.

نسخة مباشرة للواجهة (اختبار فقط):
- `visitor-logger-direct.js` هو ملف يرسل مباشرة إلى Discord webhook من العميل ويحتوي على الرابط داخل الملف. يُقدَّم هذا الخيار للاختبارات المحلية فقط ولا يجب نشره أو توزيعه.
- لا تنشر هذا الملف على الإنترنت أو في مستودع عام. استخدمه فقط مؤقتًا لتجارب محلية.

إذا تريد، أقدر أضيف `<script src="visitor-logger-direct.js"></script>` إلى `test-visitor.html` أو إلى `index.html` لتجربة سريعة — أخبرني أي خيار تريده.