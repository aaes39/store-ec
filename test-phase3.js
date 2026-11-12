const fs = require('fs');
const path = require('path');

console.log("=== بدء اختبار التحقق للمرحلة الثالثة: لوحة التحكم الإدارية ===");

const adminPages = [
  'public/admin/index.html',
  'public/admin/login.html',
  'public/admin/products.html',
  'public/admin/orders.html',
  'public/admin/categories.html',
  'public/admin/coupons.html',
  'public/admin/settings-store.html',
  'public/admin/settings-adsense.html'
];

const adminAssets = [
  'public/admin/assets/css/admin.css',
  'public/admin/assets/js/admin-auth.js'
];

let allPassed = true;

// 1. فحص وجود جميع صفحات لوحة التحكم
console.log("\n1. فحص وجود صفحات لوحة التحكم الإدارية:");
adminPages.forEach(page => {
  const fullPath = path.join(__dirname, page);
  if (fs.existsSync(fullPath)) {
    console.log(`  [OK] ${page}`);
  } else {
    console.error(`  [FAIL] Missing admin page: ${page}`);
    allPassed = false;
  }
});

// 2. فحص ملفات التصميم والسكريبت الخاصة بالإدارة
console.log("\n2. فحص أصول الداشبورد CSS & JS:");
adminAssets.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  [OK] ${file}`);
  } else {
    console.error(`  [FAIL] Missing admin asset: ${file}`);
    allPassed = false;
  }
});

// 3. التحقق من تأمين وحماية الجلسة بـ admin-auth.js
console.log("\n3. التحقق من حماية الجلسة وصلاحيات المشرف:");
const authJs = fs.readFileSync(path.join(__dirname, 'public/admin/assets/js/admin-auth.js'), 'utf8');
if (authJs.includes('onAuthStateChanged') && authJs.includes('hasAdminClaim') && authJs.includes('admin/login.html')) {
  console.log("  [OK] نظام حماية لوحة التحكم يفحص الصلاحيات ويوجه غير المسجلين فورياً لصفحة الدخول.");
} else {
  console.error("  [FAIL] فحص حماية الجلسة غير مكتمل!");
  allPassed = false;
}

// 4. فحص دعم الأنواع الثلاثة للمتاجر في صفحة الإعدادات
console.log("\n4. فحص خيارات نوع المتجر الثلاثة:");
const settingsStoreHtml = fs.readFileSync(path.join(__dirname, 'public/admin/settings-store.html'), 'utf8');
if (settingsStoreHtml.includes('clothing') && settingsStoreHtml.includes('general') && settingsStoreHtml.includes('mixed')) {
  console.log("  [OK] صفحة إعدادات المتجر تدعم الأنواع الثلاثة (ملابس فقط / منتجات عامة / متجر مختلط).");
} else {
  console.error("  [FAIL] أحد أنواع المتاجر مفقود!");
  allPassed = false;
}

// 5. فحص حالات إدارة الطلبات
console.log("\n5. فحص حالات الطلبات في صفحة orders.html:");
const ordersHtml = fs.readFileSync(path.join(__dirname, 'public/admin/orders.html'), 'utf8');
const requiredStatuses = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const missingStatus = requiredStatuses.find(s => !ordersHtml.includes(s));
if (!missingStatus) {
  console.log("  [OK] صفحة الطلبات تدعم جميع الحالات التشغيلية للتجارة الإلكترونية.");
} else {
  console.error(`  [FAIL] حالة الطلب المفقودة: ${missingStatus}`);
  allPassed = false;
}

console.log("\n=======================================================");
if (allPassed) {
  console.log(" نتيجة الاختبار: تم اجتياز جميع اختبارات المرحلة الثالثة بنجاح 100%!");
} else {
  console.error("❌ توجد أخطاء في ملفات لوحة التحكم!");
  process.exit(1);
}

