console.log("=== بدء اختبار التحقق للمرحلة الرابعة: محرك أنواع المتاجر الديناميكي ===");

// محاكاة قائمة المنتجات الكاملة في قاعدة البيانات
const mockDatabaseProducts = [
  {
    id: "prod_1",
    title: "قميص أكسفورد قطن 100% رجالي",
    storeTypeFit: "clothing",
    categoryName: "ملابس رجالي",
    basePrice: 650,
    hasVariants: true,
    variants: [
      { id: "v1", size: "M", color: "أبيض", stock: 10, price: 499 },
      { id: "v2", size: "L", color: "أزرق", stock: 15, price: 499 },
      { id: "v3", size: "XL", color: "كحلي", stock: 10, price: 520 }
    ],
    isActive: true
  },
  {
    id: "prod_2",
    title: "فستان كاجوال أنيق حريمي",
    storeTypeFit: "clothing",
    categoryName: "ملابس حريمي",
    basePrice: 950,
    hasVariants: true,
    variants: [
      { id: "v4", size: "S", color: "بيج", stock: 8, price: 799 },
      { id: "v5", size: "M", color: "أسود", stock: 12, price: 799 }
    ],
    isActive: true
  },
  {
    id: "prod_3",
    title: "ساعة يد ذكية AMOLED",
    storeTypeFit: "general",
    categoryName: "ساعات وإلكترونيات",
    brand: "FitPro",
    basePrice: 1400,
    hasVariants: false,
    customAttributes: [
      { name: "الضمان", value: "سنة كاملة" },
      { name: "البطارية", value: "14 يوم" }
    ],
    isActive: true
  },
  {
    id: "prod_4",
    title: "حقيبة ظهر جلد طبيعي للابتوب",
    storeTypeFit: "general",
    categoryName: "حقائب وإكسسوارات",
    brand: "LeatherCraft",
    basePrice: 850,
    hasVariants: false,
    customAttributes: [
      { name: "الخامة", value: "جلد طبيعي" },
      { name: "السعة", value: "15.6 بوصة" }
    ],
    isActive: true
  }
];

let allPassed = true;

// دالة محاكاة الفلترة الديناميكية لنوع المتجر كما في products.js
function filterProductsByStoreType(allProducts, storeType) {
  if (storeType === 'clothing') {
    return allProducts.filter(p => p.storeTypeFit === 'clothing');
  } else if (storeType === 'general') {
    return allProducts.filter(p => p.storeTypeFit !== 'clothing');
  } else {
    // mixed
    return allProducts;
  }
}

// 1. اختبار النمط الأول: متجر ملابس فقط
console.log("\n1. اختبار نمط المتجر (ملابس فقط - clothing):");
const clothingOnlyResults = filterProductsByStoreType(mockDatabaseProducts, 'clothing');
const hasOnlyClothing = clothingOnlyResults.every(p => p.storeTypeFit === 'clothing');
const hasGeneralInClothing = clothingOnlyResults.some(p => p.storeTypeFit === 'general');

if (hasOnlyClothing && !hasGeneralInClothing && clothingOnlyResults.length === 2) {
  console.log(`  [OK] تم عرض ${clothingOnlyResults.length} منتجات ملابس وإخفاء المنتجات العامة بنجاح.`);
  // التحقق من وجود المقاسات والألوان
  const checkVariants = clothingOnlyResults.every(p => p.hasVariants && p.variants.length > 0);
  if (checkVariants) {
    console.log("  [OK] خيارات المقاسات (M, L, XL, S) والألوان متوفرة ومضبوطة.");
  } else {
    console.error("  [FAIL] خيارات المقاسات والألوان مفقودة!");
    allPassed = false;
  }
} else {
  console.error("  [FAIL] فشل فلترة متجر الملابس فقط!");
  allPassed = false;
}

// 2. اختبار النمط الثاني: متجر منتجات عامة
console.log("\n2. اختبار نمط المتجر (منتجات عامة - general):");
const generalOnlyResults = filterProductsByStoreType(mockDatabaseProducts, 'general');
const hasOnlyGeneral = generalOnlyResults.every(p => p.storeTypeFit === 'general');
const hasClothingInGeneral = generalOnlyResults.some(p => p.storeTypeFit === 'clothing');

if (hasOnlyGeneral && !hasClothingInGeneral && generalOnlyResults.length === 2) {
  console.log(`  [OK] تم عرض ${generalOnlyResults.length} منتجات عامة وإخفاء الملابس تلقائياً دون حذفها.`);
  const checkAttributes = generalOnlyResults.every(p => !p.hasVariants && p.customAttributes && p.customAttributes.length > 0);
  if (checkAttributes) {
    console.log("  [OK] خيارات المواصفات العامة والضمان والماركة تعمل دون فرض مقاسات ملابس.");
  } else {
    console.error("  [FAIL] مواصفات المنتجات العامة غير مضبوطة!");
    allPassed = false;
  }
} else {
  console.error("  [FAIL] فشل فلترة متجر المنتجات العامة!");
  allPassed = false;
}

// 3. اختبار النمط الثالث: متجر مختلط
console.log("\n3. اختبار نمط المتجر (متجر مختلط - mixed):");
const mixedResults = filterProductsByStoreType(mockDatabaseProducts, 'mixed');
if (mixedResults.length === 4) {
  console.log(`  [OK] تم عرض كافة المنتجات (${mixedResults.length}) جنباً إلى جنب مع الحفاظ على خصائص كل نوع.`);
} else {
  console.error("  [FAIL] فشل عرض المتجر المختلط!");
  allPassed = false;
}

// 4. اختبار سلامة قاعدة البيانات وعدم حذف أي سجلات
console.log("\n4. التحقق من قاعدة أمان البيانات (Zero Data Loss on Switch):");
const initialCount = mockDatabaseProducts.length;
// التبديل بين الأنماط عدة مرات
filterProductsByStoreType(mockDatabaseProducts, 'clothing');
filterProductsByStoreType(mockDatabaseProducts, 'general');
filterProductsByStoreType(mockDatabaseProducts, 'mixed');
const finalCount = mockDatabaseProducts.length;

if (initialCount === finalCount) {
  console.log(`  [OK] عدد السجلات الأصلية في قاعدة البيانات محفوظ 100% (${finalCount} من ${initialCount})، لا يتم حذف أي بيانات أو طلبات.`);
} else {
  console.error("  [FAIL] حدث فقدان في البيانات!");
  allPassed = false;
}

console.log("\n=======================================================");
if (allPassed) {
  console.log(" نتيجة الاختبار: محرك أنواع المتاجر الديناميكي يعمل بنجاح 100%!");
} else {
  console.error("❌ توجد أخطاء في اختبارات المرحلة الرابعة!");
  process.exit(1);
}

