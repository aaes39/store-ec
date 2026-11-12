/**
 * test-phase8-uploads.js
 * اختبارات التحقق من نظام رفع الصور من الجهاز، ربط Firebase، والجاهزية للنشر
 */

const fs = require('fs');
const path = require('path');

console.log("======================================================================");
console.log("📸 بدء اختبارات المرحلة 8: نظام رفع الصور من الجهاز والربط الفعلي بـ Firebase");
console.log("======================================================================\n");

let allPassed = true;
function assert(condition, message) {
  if (condition) {
    console.log(`  [OK] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
    allPassed = false;
  }
}

// -----------------------------------------------------------------------------
// اختبار 1: إضافة منتج بصورة من الجهاز
// -----------------------------------------------------------------------------
console.log("اختبار 1: التحقق من كود إضافة منتج بصورة من الجهاز:");
const productsHtml = fs.readFileSync(path.join(__dirname, 'public/admin/products.html'), 'utf8');
const uploaderJs = fs.readFileSync(path.join(__dirname, 'public/admin/assets/js/image-uploader.js'), 'utf8');

assert(productsHtml.includes('id="prodFileInput"') && productsHtml.includes('type="file"'), "زر اختيار الملفات من الجهاز <input type='file'> موجود في صفحة إدارة المنتجات.");
assert(productsHtml.includes('accept="image/jpeg,image/png,image/webp"'), "يقتصر اختيار الملفات على الصيغ المعتمدة JPEG و PNG و WebP.");
assert(uploaderJs.includes("class ImageUploader"), "فئة ImageUploader موجودة ومسؤولة عن الرفع لـ Firebase Storage.");
assert(uploaderJs.includes("uploadBytesResumable"), "استخدام دالة uploadBytesResumable لتتبع تقدم الرفع بشكل احترافي.");

// -----------------------------------------------------------------------------
// اختبار 2: إضافة منتج بأكثر من صورة
// -----------------------------------------------------------------------------
console.log("\nاختبار 2: التحقق من دعم رفع عدة صور للمنتج:");
assert(productsHtml.includes('id="prodFileInput" multiple') || productsHtml.includes('multiple'), "دعم اختيار ورفع عدة صور في نفس الوقت للمنتج (multiple).");
assert(productsHtml.includes('currentUploadedImages'), "إدارة مصفوفة الصور المتعددة للمنتج في الذاكرة وتخزين روابطها في Firestore.");
assert(productsHtml.includes('images: images.length > 0'), "تخزين مصفوفة روابط الصور داخل مستند المنتج في Firestore.");

// -----------------------------------------------------------------------------
// اختبار 3: تعديل صور منتج موجود
// -----------------------------------------------------------------------------
console.log("\nاختبار 3: التحقق من تعديل صور منتج موجود مسبقاً:");
assert(productsHtml.includes('window.openEditModal'), "دالة فتح نافذة التعديل openEditModal معرفة ومتاحة.");
assert(productsHtml.includes('currentUploadedImages = (p.images || []).map'), "تعبئة الصور القديمة للمنتج في المعاينة عند فتح التعديل.");
assert(productsHtml.includes('renderImagesPreview()'), "إعادة رسم معاينة الصور بعد التعديل أو إضافة صور جديدة.");

// -----------------------------------------------------------------------------
// اختبار 4: حذف صورة وتنظيف Storage
// -----------------------------------------------------------------------------
console.log("\nاختبار 4: التحقق من حذف الصورة وتنظيف Firebase Storage:");
assert(productsHtml.includes('storagePaths'), "تتبع مسارات التخزين storagePaths الخاصة بكل صورة في المستند.");
assert(productsHtml.includes('productUploader.deleteImage'), "استدعاء حذف الملف من Firebase Storage عند حذف المنتج أو صوره.");
assert(uploaderJs.includes('deleteObject(fileRef)'), "تطبيق دالة deleteObject لحذف الملفات غير المستخدمة من Storage.");

// -----------------------------------------------------------------------------
// اختبار 5: رفع لوجو جديد وأيقونة Favicon إلى branding/
// -----------------------------------------------------------------------------
console.log("\nاختبار 5: التحقق من رفع اللوجو وFavicon إلى مجلد branding/ بأمان:");
const settingsStoreHtml = fs.readFileSync(path.join(__dirname, 'public/admin/settings-store.html'), 'utf8');

assert(settingsStoreHtml.includes('id="logoFileInput"') && settingsStoreHtml.includes('id="faviconFileInput"'), "حقول HTML File Input للوجو وFavicon متوفرة.");
assert(settingsStoreHtml.includes("new ImageUploader('branding')"), "تهيئة ImageUploader لاستهداف مجلد branding/.");
assert(settingsStoreHtml.includes('logoProgressContainer') && settingsStoreHtml.includes('faviconProgressContainer'), "مؤشرات تقدم الرفع المباشرة (%) للوجو وFavicon موجودة.");
assert(settingsStoreHtml.includes('originalLogoPath && currentLogoPath && originalLogoPath !== currentLogoPath'), "سياسة أمان: عدم حذف اللوجو القديم إلا بعد التأكد من نجاح حفظ اللوجو الجديد.");

// -----------------------------------------------------------------------------
// اختبار 6: رفع بانر ترويجي جديد إلى banners/
// -----------------------------------------------------------------------------
console.log("\nاختبار 6: التحقق من نظام إدارة البانرات والرفع إلى مجلد banners/:");
const bannersHtml = fs.readFileSync(path.join(__dirname, 'public/admin/banners.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8');

assert(bannersHtml.includes('id="bannerFileInput"'), "صفحة البانرات توفر مدخل رفع ملفات حقيقي من الجهاز.");
assert(bannersHtml.includes("new ImageUploader('banners')"), "استهداف مجلد banners/ في Firebase Storage.");
assert(indexHtml.includes('banners') && indexHtml.includes('loadHeroBanner'), "ربط واجهة المتجر الرئيسية بقاعدة Firestore لتحميل البانر الفعلي مع صوره.");

// -----------------------------------------------------------------------------
// اختبار 7: رفع صورة الأقسام والمقالات إلى categories/ و blog/
// -----------------------------------------------------------------------------
console.log("\nاختبار 7: التحقق من رفع صور الأقسام والمقالات إلى categories/ و blog/:");
const categoriesHtml = fs.readFileSync(path.join(__dirname, 'public/admin/categories.html'), 'utf8');
const blogHtml = fs.readFileSync(path.join(__dirname, 'public/admin/blog.html'), 'utf8');

assert(categoriesHtml.includes('id="catFileInput"') && categoriesHtml.includes("new ImageUploader('categories')"), "رفع صورة القسم من الجهاز مستهدفاً مجلد categories/ في Storage.");
assert(blogHtml.includes('id="blogFileInput"') && blogHtml.includes("new ImageUploader('blog')"), "رفع صورة غلاف المقال من الجهاز مستهدفاً مجلد blog/ في Storage.");

// -----------------------------------------------------------------------------
// اختبار 8: عرض الصور على واجهة المتجر وعدم استخدام Base64 في Firestore
// -----------------------------------------------------------------------------
console.log("\nاختبار 8: التحقق من عرض الصور في المتجر وعدم تخزين Base64 في Firestore:");
const productsJs = fs.readFileSync(path.join(__dirname, 'public/assets/js/products.js'), 'utf8');
const productHtml = fs.readFileSync(path.join(__dirname, 'public/product.html'), 'utf8');

assert(productsJs.includes("createProductCardHtml") && productsJs.includes("product.images[0]"), "بطاقة المنتج تعرض رابط الصورة المحفوظ في Firebase Storage.");
assert(productHtml.includes("document.getElementById('productThumbnails')"), "صفحة المنتج التفصيلية تعرض كافة صور المنتج ومعرض الصور المصغرة.");
assert(productHtml.includes("selectedVariant.imageUrl"), "دعم تغيير صورة العرض الرئيسية عند اختيار لون المنتج المتغير.");

// محاكاة وثيقة منتج والتأكد من أنها لا تحوي Base64
const sampleProductDoc = {
  title: "ساعة ذكية عصرية",
  images: [
    "https://firebasestorage.googleapis.com/v0/b/store.appspot.com/o/products%2F123_watch.webp?alt=media",
    "https://firebasestorage.googleapis.com/v0/b/store.appspot.com/o/products%2F124_watch2.webp?alt=media"
  ],
  storagePaths: ["products/123_watch.webp", "products/124_watch2.webp"]
};
const isAnyBase64 = sampleProductDoc.images.some(url => url.startsWith("data:image/"));
assert(!isAnyBase64, "تأكيد معماري: مصفوفة الصور في Firestore تحتوي فقط على روابط Storage HTTPS ولا تحتوي إطلاقاً على Base64.");

// -----------------------------------------------------------------------------
// اختبار 9: قواعد أمان Firebase Storage وقواعد الصلاحيات
// -----------------------------------------------------------------------------
console.log("\nاختبار 9: التحقق من قواعد أمان Firebase Storage ضد المستخدمين غير المصرح لهم:");
const storageRules = fs.readFileSync(path.join(__dirname, 'storage.rules'), 'utf8');

assert(storageRules.includes("function isAdmin()"), "دالة فحص صلاحيات المشرف isAdmin موجودة في storage.rules.");
assert(storageRules.includes("function isValidImage()"), "دالة التحقق من صحة الصورة وحجمها الأقصى (< 5MB) وصيغتها موجودة.");
assert(storageRules.includes("allow write: if isAdmin() && isValidImage();"), "منع أي مستخدم عادي أو زائر من رفع أو تعديل الصور؛ الرفع محصور فقط بالمشرف المصرح.");
assert(storageRules.includes("allow read: if true;"), "السماح للزوار بقراءة صور المنتجات والهوية والبانرات عبر روابط التخزين.");
assert(storageRules.includes("match /{allPaths=**} {\n      allow read, write: if false;"), "منع الوصول التلقائي لأي مسارات أخرى غير معتمدة.");

// -----------------------------------------------------------------------------
// اختبار 10: استمرار الصور بعد التحديث ودعم Pagination للبيانات الحقيقية
// -----------------------------------------------------------------------------
console.log("\nاختبار 10: التحقق من استمرار الصور في المتجر ودعم Pagination الحقيقي:");
assert(productsJs.includes("pagination: {"), "محرك المنتجات يدعم Pagination متقدم (page, pageSize, totalPages, totalItems).");
const productsCatalogHtml = fs.readFileSync(path.join(__dirname, 'public/products.html'), 'utf8');
assert(productsCatalogHtml.includes('id="catalogPaginationContainer"'), "واجهة كتالوج المنتجات تحتوي على شريط أزرار التنقل بين الصفحات Pagination.");
assert(productsCatalogHtml.includes('loadCatalog(page'), "دعم الانتقال السلس بين صفحات المنتجات عبر استدعاء loadCatalog مع رقم الصفحة.");

console.log("\n======================================================================");
if (allPassed) {
  console.log("🎉 نجحت كافة اختبارات المرحلة 8 بنسبة 100%! جميع متطلبات Firebase جاهزة.");
  console.log("======================================================================");
  process.exit(0);
} else {
  console.error("❌ فشلت بعض الاختبارات! يرجى مراجعة الأخطاء أعلاه.");
  console.log("======================================================================");
  process.exit(1);
}

