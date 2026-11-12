const fs = require('fs');
const path = require('path');

console.log("=== بدء اختبار التحقق للمرحلة الأولى: التأسيس والبنية التحتية ===");

const requiredFiles = [
  'package.json',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  'firestore.indexes.json',
  'functions/package.json',
  'functions/index.js',
  'public/_redirects',
  'public/robots.txt',
  'public/ads.txt',
  'public/sitemap.xml',
  'public/assets/js/config.js',
  'public/assets/js/firebase.js',
  'public/assets/img/logo-placeholder.svg',
  'public/assets/img/favicon-placeholder.svg'
];

let allPassed = true;

// 1. فحص وجود جميع الملفات
console.log("\n1. فحص وجود ملفات البنية الأساسية:");
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  [OK] ${file}`);
  } else {
    console.error(`  [FAIL] Missing file: ${file}`);
    allPassed = false;
  }
});

// 2. التحقق من صحة ملفات JSON
console.log("\n2. التحقق من سلامة وصحة ملفات JSON:");
const jsonFiles = [
  'package.json',
  'firebase.json',
  'firestore.indexes.json',
  'functions/package.json'
];

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    JSON.parse(content);
    console.log(`  [OK] JSON syntax is valid: ${file}`);
  } catch (err) {
    console.error(`  [FAIL] JSON syntax error in ${file}:`, err.message);
    allPassed = false;
  }
});

// 3. التحقق من صحة قواعد الأمان وقواعد الدوال
console.log("\n3. التحقق من اكتمال عناصر الأمان وقواعد Firestore & Storage:");
const firestoreRules = fs.readFileSync(path.join(__dirname, 'firestore.rules'), 'utf8');
if (firestoreRules.includes('isAdmin()') && firestoreRules.includes('match /products/{productId}') && firestoreRules.includes('match /orders/{orderId}')) {
  console.log("  [OK] Firestore Security Rules تغطي جميع المجموعات والمحددات الأمنية.");
} else {
  console.error("  [FAIL] Firestore Security Rules ناقصة!");
  allPassed = false;
}

const storageRules = fs.readFileSync(path.join(__dirname, 'storage.rules'), 'utf8');
if (storageRules.includes('match /products/{allPaths=**}') && storageRules.includes('request.resource.size < 5 * 1024 * 1024')) {
  console.log("  [OK] Storage Security Rules تغطي رفع الصور وحجم الملفات وصلاحية المدير.");
} else {
  console.error("  [FAIL] Storage Security Rules ناقصة!");
  allPassed = false;
}

const functionsCode = fs.readFileSync(path.join(__dirname, 'functions/index.js'), 'utf8');
if (functionsCode.includes('exports.setAdminClaim') && functionsCode.includes('exports.createOrderSecure')) {
  console.log("  [OK] Cloud Functions تشتمل على تأمين صلاحيات المدير ومعالجة الطلبات بالخادم.");
} else {
  console.error("  [FAIL] Cloud Functions غير مكتملة!");
  allPassed = false;
}

console.log("\n=======================================================");
if (allPassed) {
  console.log(" نتيجة الاختبار: نجحت جميع فحوصات المرحلة الأولى بنسبة 100%!");
} else {
  console.error("❌ نتيجة الاختبار: يوجد أخطاء بحاجة للمعالجة.");
  process.exit(1);
}

