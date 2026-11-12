# دليل تشغيل ونشر منصة المتاجر الإلكترونية الديناميكية 🚀
### منصة تجارة إلكترونية متكاملة، مؤمنة، وقابلة للتخصيص التجاري

---

## 📌 جدول المحتويات
1. [المواصفات والمعمارية التقنية](#1-المواصفات-والمعمارية-التقنية)
2. [هيكل المجلدات والمسارات](#2-هيكل-المجلدات-والمسارات)
3. [خطوات تهيئة مشروع Firebase](#3-خطوات-تهيئة-مشروع-firebase)
4. [إنشاء حساب المشرف وتفعيل الصلاحيات (Custom Claims)](#4-إنشاء-حساب-المشرف-وتفعيل-الصلاحيات-custom-claims)
5. [النشر على Cloudflare Pages عبر GitHub](#5-النشر-على-cloudflare-pages-عبر-github)
6. [ربط الدومين المخصص وتفعيل SSL](#6-ربط-الدومين-المخصص-وتفعيل-ssl)
7. [تفعيل إعلانات Google AdSense وملف ads.txt](#7-تفعيل-إعلانات-google-adsense-وملف-adstxt)
8. [دليل استخدام لوحة التحكم للمدير](#8-دليل-استخدام-لوحة-التحكم-للمدير)

---

## 1. المواصفات والمعمارية التقنية

- **الواجهة الأمامية**: HTML5 الدلالي + CSS3 (باستخدام CSS Custom Properties للهوية الديناميكية) + Vanilla JavaScript ES6+ Modules (سرعة فائقة وزمن تحميل 0ms Hydration).
- **الاتجاه واللغة**: دعم كامل للغة العربية ونظام الكتابة من اليمين إلى اليسار (RTL) مع العملة المصرية (EGP).
- **الخدمات السحابية**:
  - **Firebase Authentication**: تسجيل دخول الإدارة الآمن.
  - **Firebase Firestore**: قاعدة البيانات السحابية الحية للمنتجات والطلبات والإعدادات.
  - **Firebase Storage**: تخزين سحابي لصور المنتجات والبنرات مع قواعد أمان لحجم الملفات.
  - **Firebase Cloud Functions**: العمليات السحابية الحساسة والتحقق من الأسعار والمخزون.
- **الاستضافة**: **Cloudflare Pages** (دومين موحد يستضيف المتجر ولوحة التحكم `/admin` مع توجيهات مسارات نظيفة وسرعة وصول فائقة عبر شبكة CDN عالمية).
- **التكلفة**: **0$ (مجانية تماماً في خطط البداية السخية لـ Firebase و Cloudflare)**.

---

## 2. هيكل المجلدات والمسارات

```
Store/
├── public/                       # مجلد الاستضافة والنشر على Cloudflare Pages
│   ├── index.html                # الصفحة الرئيسية
│   ├── products.html             # كتالوج المنتجات، البحث، والفلترة
│   ├── product.html              # صفحة تفاصيل المنتج والمقاسات والألوان
│   ├── cart.html                 # سلة المشتريات المستقلة
│   ├── checkout.html             # صفحة إتمام الطلب واحتساب الشحن
│   ├── order-tracking.html       # صفحة تتبع الطلب والشحنة
│   ├── blog.html                 # مدونة ومقالات المتجر (لدعم SEO و AdSense)
│   ├── post.html                 # صفحة عرض المقال
│   ├── _redirects                # توجيهات Cloudflare Pages لدعم /admin
│   ├── ads.txt                   # ملف إعلانات Google الرسمي
│   ├── robots.txt                # توجيهات محركات البحث
│   ├── sitemap.xml               # خريطة الموقع
│   ├── pages/                    # صفحات السياسات (privacy, terms, cookies, about, contact)
│   ├── assets/
│   │   ├── css/ (main.css, components.css, responsive.css)
│   │   └── js/  (config.js, firebase.js, store-engine.js, cart.js, products.js, adsense.js, cookie-consent.js)
│   └── admin/                    # لوحة التحكم المركزية
│       ├── index.html            # الرئيسية والإحصائيات
│       ├── login.html            # تسجيل دخول المشرف
│       ├── products.html         # إدارة المنتجات والمتغيرات
│       ├── orders.html           # إدارة وتحديث حالات الطلبات
│       ├── categories.html       # إدارة الأقسام
│       ├── coupons.html          # إدارة الكوبونات
│       ├── settings-store.html   # نوع المتجر والهوية البصرية والألوان
│       ├── settings-adsense.html # إعدادات AdSense
│       └── settings-seo.html     # إعدادات محركات البحث
├── functions/                    # الدوال السحابية الآمنة
├── scripts/                      # سكربتات التهيئة الآمنة (init-admin.js)
├── firestore.rules               # قواعد أمان قاعدة البيانات
├── storage.rules                 # قواعد أمان رفع الصور
└── firebase.json                 # إعدادات مشروع Firebase
```

---

## 3. خطوات تهيئة مشروع Firebase

1. انتقل إلى [Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعاً جديداً.
2. فعّل الخدمات الآتية:
   - **Authentication**: اختر طريقة تسجيل الدخول (Email/Password).
   - **Firestore Database**: أنشئ قاعدة البيانات في وضع Production.
   - **Storage**: فعّل خدمة التخزين السحابي.
3. انسخ إعدادات تطبيق الويب (`firebaseConfig`) من إعدادات المشروع وضعها داخل:
   [`public/assets/js/config.js`](file:///c:/Users/ELite/Desktop/Store/public/assets/js/config.js) في كائن `APP_CONFIG.firebase`.
4. لنشر قواعد الأمان والدوال السحابية:
   ```bash
   npx firebase login
   npx firebase deploy --only firestore:rules,storage:rules
   ```

---

## 4. إنشاء حساب المشرف وتفعيل الصلاحيات (Custom Claims)

تطبيقاً لأعلى معايير الأمان، لا يسمح بإنشاء حساب مدير من المتجر مباشرة:
1. في **Firebase Console > Authentication**، انقر على **Add User** وأنشئ حساب المشرف بالبريد الإلكتروني وكلمة المرور.
2. احصل على ملف مفتاح الخدمة `serviceAccountKey.json` من:
   `Project Settings > Service Accounts > Generate new private key`.
3. ضعه في المجلد الرئيسي وشغّل السكربت:
   ```bash
   node scripts/init-admin.js admin@yourstore.com
   ```
4. ستحصل فوراً على الصلاحية الإدارية الكاملة `{ admin: true }` ويمكنك تسجيل الدخول مباشرة من:
   `https://your-domain.com/admin/login.html`

---

## 5. النشر على Cloudflare Pages عبر GitHub

1. ارفع المشروع إلى مستودع على **GitHub**:
   ```bash
   git add .
   git commit -m "deploy: ready for production"
   git remote add origin https://github.com/your-username/your-store-repo.git
   git push -u origin master
   ```
2. ادخل إلى لوحة تحكم [Cloudflare Dashboard](https://dash.cloudflare.com/) واختر **Workers & Pages > Create application > Pages > Connect to Git**.
3. اختر المستودع الخاص بك وحدد الإعدادات الآتية:
   - **Project Name**: اسم متجرك.
   - **Production Branch**: `master` (أو `main`).
   - **Framework Preset**: `None`.
   - **Build Output Directory**: `public`
4. انقر على **Save and Deploy**. خلال 60 ثانية سيكون متجرك ولوحة التحكم `/admin` منشورين على نطاق عالمي فائق السرعة!

---

## 6. ربط الدومين المخصص وتفعيل SSL

1. من صفحة مشروعك في Cloudflare Pages، انتقل إلى تبويب **Custom Domains**.
2. انقر على **Set up a custom domain** واكتب نطاقك (مثال: `www.yourstore.com` أو `yourstore.com`).
3. يقوم Cloudflare بتهيئة الـ DNS وتفعيل شهادة الأمان **HTTPS / SSL مجاناً وتلقائياً**.

---

## 7. تفعيل إعلانات Google AdSense وملف ads.txt

1. افتح لوحة التحكم الإدارية: `/admin/settings-adsense.html`.
2. أدخل معرف الناشر الخاص بك من Google AdSense بصيغة: `ca-pub-XXXXXXXXXXXXXXXX`.
3. اضغط على زر تفعيل الإعلانات ثم انقر **حفظ**.
4. ملف `ads.txt` متوفر تلقائياً في مسار المتجر `https://yourdomain.com/ads.txt`.
5. جميع الصفحات الحساسة (السلة، الدفع، ولوحة التحكم) محظورة ومستثناة تلقائياً من ظهور الإعلانات وفق سياسات Google المعتمدة.
6. نظام الموافقة على الكوكيز (`cookie-consent.js`) مدمج ومفعل لحماية حسابك والامتثال لسياسات الموافقة (Google Consent Mode).

---

## 8. دليل استخدام لوحة التحكم للمدير

- **الرئيسية والإحصائيات (`/admin/index.html`)**: متابعة المبيعات بالجنيه المصري، إجمالي الطلبات، وتنبيهات نواقص المخزون.
- **إدارة المنتجات (`/admin/products.html`)**: إضافة وحذف وتعديل المنتجات، رفع الصور، وتحديد المقاسات والألوان والأسعار.
- **إدارة الطلبات (`/admin/orders.html`)**: فحص تفاصيل العميل، العنوان، وتحديث حالة الطلب (جديد -> تم التأكيد -> قيد التجهيز -> تم الشحن -> تم التسليم).
- **نوع وهُوية المتجر (`/admin/settings-store.html`)**:
  - التبديل بنقرة واحدة بين: **متجر ملابس فقط** | **منتجات عامة** | **متجر مختلط**.
  - تغيير ألوان الموقع الحية واللوجو واسم المتجر وأرقام التواصل دون لمس كود البرمجة.
- **الكوبونات والأقسام (`/admin/coupons.html`)**: إنشاء كود خصم بنسبة مئوية أو مبلغ ثابت.

---
تم إعداد هذا النظام ليكون متيناً، قابلاً للتوسع التجاري، وجاهزاً لتشغيل متاجر متعددة وإعادة استخدامه بكل سهولة! 🎉

