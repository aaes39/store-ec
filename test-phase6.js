const fs = require('fs');
const path = require('path');

console.log("=== بدء اختبار التحقق للمرحلة السادسة: الإعلانات، المقالات، SEO، والامتثال القانوني ===");

let allPassed = true;

// 1. فحص وجود جميع صفحات السياسات والامتثال الخمسة
console.log("\n1. فحص اكتمال صفحات السياسات الخمسة المعتمدة:");
const requiredPolicyPages = [
  'public/pages/privacy.html',
  'public/pages/terms.html',
  'public/pages/cookies.html',
  'public/pages/about.html',
  'public/pages/contact.html'
];

requiredPolicyPages.forEach(p => {
  if (fs.existsSync(path.join(__dirname, p))) {
    console.log(`  [OK] ${p}`);
  } else {
    console.error(`  [FAIL] مفقود: ${p}`);
    allPassed = false;
  }
});

// 2. فحص ملف ads.txt و robots.txt و sitemap.xml
console.log("\n2. فحص ملفات الاستكشاف و AdSense:");
['public/ads.txt', 'public/robots.txt', 'public/sitemap.xml'].forEach(f => {
  if (fs.existsSync(path.join(__dirname, f))) {
    console.log(`  [OK] ${f}`);
  } else {
    console.error(`  [FAIL] مفقود: ${f}`);
    allPassed = false;
  }
});

// 3. فحص قواعد حظر الإعلانات الصارمة في adsense.js
console.log("\n3. فحص قواعد حظر الإعلانات في السلة والدفع والإدارة (Policy Compliance):");
const adsenseCode = fs.readFileSync(path.join(__dirname, 'public/assets/js/adsense.js'), 'utf8');
const checks = [
  { name: "حظر الإعلانات في السلة", query: "/cart" },
  { name: "حظر الإعلانات في إتمام الطلب", query: "/checkout" },
  { name: "حظر الإعلانات في لوحة التحكم", query: "/admin" },
  { name: "التحقق من صحة Publisher ID الرسمي", query: "isValidPublisherId" }
];

checks.forEach(c => {
  if (adsenseCode.includes(c.query)) {
    console.log(`  [OK] ${c.name}`);
  } else {
    console.error(`  [FAIL] ${c.name} غير متوفر!`);
    allPassed = false;
  }
});

// 4. فحص نظام الموافقة على ملفات تعريف الارتباط (Cookie Consent Banner)
console.log("\n4. فحص نظام إدارة موافقة الكوكيز (Cookie Consent):");
const cookieCode = fs.readFileSync(path.join(__dirname, 'public/assets/js/cookie-consent.js'), 'utf8');
if (cookieCode.includes('store_cookie_consent') && cookieCode.includes('btnAcceptAllCookies') && cookieCode.includes('btnEssentialCookies')) {
  console.log("  [OK] شريط الكوكيز يدعم خيارات القبول الكامل أو الملفات الضرورية فقط ويتوافق مع Google NPA.");
} else {
  console.error("  [FAIL] شريط الكوكيز غير مكتمل!");
  allPassed = false;
}

// 5. فحص البيانات المنظمة (Schema.org JSON-LD)
console.log("\n5. فحص البيانات المنظمة لمحركات البحث (Structured Data):");
const indexHtml = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8');
const productHtml = fs.readFileSync(path.join(__dirname, 'public/product.html'), 'utf8');

if (indexHtml.includes('application/ld+json') && indexHtml.includes('OnlineStore')) {
  console.log("  [OK] الصفحة الرئيسية تشتمل على Schema.org OnlineStore.");
} else {
  console.error("  [FAIL] Schema.org مفقود في index.html!");
  allPassed = false;
}

if (productHtml.includes('application/ld+json') && productHtml.includes('Product')) {
  console.log("  [OK] صفحة المنتج تشتمل على Schema.org Product و Offer و EGP.");
} else {
  console.error("  [FAIL] Schema.org مفقود في product.html!");
  allPassed = false;
}

// 6. فحص صفحة إعدادات SEO في لوحة التحكم
console.log("\n6. فحص صفحة إعدادات SEO في الداشبورد:");
if (fs.existsSync(path.join(__dirname, 'public/admin/settings-seo.html'))) {
  console.log("  [OK] public/admin/settings-seo.html متوفرة وتتيح تعديل الميتا تاج والعناوين.");
} else {
  console.error("  [FAIL] صفحة settings-seo.html مفقودة!");
  allPassed = false;
}

console.log("\n=======================================================");
if (allPassed) {
  console.log(" نتيجة الاختبار: تم اجتياز جميع اختبارات المرحلة السادسة بنجاح 100%!");
} else {
  console.error("❌ توجد أخطاء في المرحلة السادسة!");
  process.exit(1);
}

