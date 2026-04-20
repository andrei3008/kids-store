import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Skip if already seeded
  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@miniboutique.ro" },
    update: {},
    create: {
      email: "admin@miniboutique.ro",
      name: "Admin MiniBoutique",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin:", admin.email);

  // Clear existing data
  await prisma.productSize.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Main categories
  const mainCats = await Promise.all([
    prisma.category.create({ data: { name: "Pentru Fete", slug: "fete", description: "Haine pentru fete", sortOrder: 1 } }),
    prisma.category.create({ data: { name: "Pentru Baieti", slug: "baieti", description: "Haine pentru baieti", sortOrder: 2 } }),
    prisma.category.create({ data: { name: "Bebelusi", slug: "bebelusi", description: "Hainute pentru bebelusi", sortOrder: 3 } }),
    prisma.category.create({ data: { name: "Accesorii", slug: "accesorii", description: "Accesorii pentru copii", sortOrder: 4 } }),
  ]);

  // Subcategories
  const subcats = {
    fete: await Promise.all([
      prisma.category.create({ data: { name: "Rochite", slug: "fete-rochite", parentId: mainCats[0].id, sortOrder: 1 } }),
      prisma.category.create({ data: { name: "Bluzite & Tricouri", slug: "fete-bluzite", parentId: mainCats[0].id, sortOrder: 2 } }),
      prisma.category.create({ data: { name: "Fuste", slug: "fete-fuste", parentId: mainCats[0].id, sortOrder: 3 } }),
      prisma.category.create({ data: { name: "Pantaloni & Jeans", slug: "fete-pantaloni", parentId: mainCats[0].id, sortOrder: 4 } }),
      prisma.category.create({ data: { name: "Hanorace & Geci", slug: "fete-hanorace", parentId: mainCats[0].id, sortOrder: 5 } }),
      prisma.category.create({ data: { name: "Seturi", slug: "fete-seturi", parentId: mainCats[0].id, sortOrder: 6 } }),
    ]),
    baieti: await Promise.all([
      prisma.category.create({ data: { name: "Tricouri & Bluze", slug: "baieti-tricouri", parentId: mainCats[1].id, sortOrder: 1 } }),
      prisma.category.create({ data: { name: "Pantaloni & Jeans", slug: "baieti-pantaloni", parentId: mainCats[1].id, sortOrder: 2 } }),
      prisma.category.create({ data: { name: "Hanorace & Geci", slug: "baieti-hanorace", parentId: mainCats[1].id, sortOrder: 3 } }),
      prisma.category.create({ data: { name: "Camasi", slug: "baieti-camasi", parentId: mainCats[1].id, sortOrder: 4 } }),
      prisma.category.create({ data: { name: "Seturi", slug: "baieti-seturi", parentId: mainCats[1].id, sortOrder: 5 } }),
      prisma.category.create({ data: { name: "Pijamale", slug: "baieti-pijamale", parentId: mainCats[1].id, sortOrder: 6 } }),
    ]),
    bebelusi: await Promise.all([
      prisma.category.create({ data: { name: "Body & Bodysuits", slug: "bebelusi-body", parentId: mainCats[2].id, sortOrder: 1 } }),
      prisma.category.create({ data: { name: "Salopete", slug: "bebelusi-salopete", parentId: mainCats[2].id, sortOrder: 2 } }),
      prisma.category.create({ data: { name: "Pijamale", slug: "bebelusi-pijamale", parentId: mainCats[2].id, sortOrder: 3 } }),
      prisma.category.create({ data: { name: "Sosete & Ciorapi", slug: "bebelusi-sosete", parentId: mainCats[2].id, sortOrder: 4 } }),
      prisma.category.create({ data: { name: "Seturi", slug: "bebelusi-seturi", parentId: mainCats[2].id, sortOrder: 5 } }),
    ]),
    accesorii: await Promise.all([
      prisma.category.create({ data: { name: "Sepci & Palarii", slug: "accesorii-sepci", parentId: mainCats[3].id, sortOrder: 1 } }),
      prisma.category.create({ data: { name: "Geanti & Rucsacuri", slug: "accesorii-geanti", parentId: mainCats[3].id, sortOrder: 2 } }),
      prisma.category.create({ data: { name: "Sosete & Ciorapi", slug: "accesorii-sosete", parentId: mainCats[3].id, sortOrder: 3 } }),
      prisma.category.create({ data: { name: "Esarfe & Fulare", slug: "accesorii-esarfe", parentId: mainCats[3].id, sortOrder: 4 } }),
    ]),
  };

  // Products assigned to subcategories
  const products = [
    // Fete - Rochite
    { name: "Rochita cu Flori", slug: "rochita-cu-flori", price: 89.99, categoryId: subcats.fete[0].id, featured: true, description: "Rochita eleganta cu print floral, 100% bumbac." },
    { name: "Rochita cu Volane", slug: "rochita-volane", price: 79.99, categoryId: subcats.fete[0].id, description: "Rochita cu volane delicate." },
    // Fete - Bluzite
    { name: "Bluza cu Broderie", slug: "bluza-cu-broderie", price: 49.99, salePrice: 39.99, categoryId: subcats.fete[1].id, description: "Bluza alba cu broderie delicata." },
    { name: "Tricou Print Floral", slug: "tricou-floral-fete", price: 35.99, categoryId: subcats.fete[1].id, description: "Tricou cu print floral colorat." },
    // Fete - Fuste
    { name: "Fusta Tutu Roz", slug: "fusta-tutu-roz", price: 59.99, categoryId: subcats.fete[2].id, featured: true, description: "Fusta tutu din tulle, ideala pentru petreceri." },
    // Fete - Seturi
    { name: "Set Rochita Cardigan", slug: "set-rochita-cardigan", price: 129.99, categoryId: subcats.fete[5].id, description: "Set complet rochita + cardigan." },

    // Baieti - Tricouri
    { name: "Tricou cu Dinozauri", slug: "tricou-dinozauri", price: 39.99, categoryId: subcats.baieti[0].id, description: "Tricou cu print amuzant, bumbac 100%." },
    // Baieti - Pantaloni
    { name: "Blugi Elastici", slug: "blugi-elastici", price: 69.99, categoryId: subcats.baieti[1].id, featured: true, description: "Blugi confortabili cu talie elastica." },
    { name: "Pantaloni Scurti", slug: "pantaloni-scurti-vara", price: 45.99, salePrice: 35.99, categoryId: subcats.baieti[1].id, description: "Pantaloni scurti pentru vara." },
    // Baieti - Hanorace
    { name: "Hanorac Colorat", slug: "hanorac-colorat", price: 109.99, categoryId: subcats.baieti[2].id, featured: true, description: "Hanorac captusit cu gluga." },

    // Bebelusi - Body
    { name: "Body Set 3 Bucati", slug: "body-set-3-bucati", price: 79.99, categoryId: subcats.bebelusi[0].id, featured: true, description: "3 body-uri din bumbac organic." },
    // Bebelusi - Salopete
    { name: "Salopeta cu Urechi", slug: "salopeta-cu-urechi", price: 59.99, categoryId: subcats.bebelusi[1].id, description: "Salopeta adorabila cu urechi de animal." },
    // Bebelusi - Pijamale
    { name: "Pijamale Iepuras", slug: "set-pijamale-iepuras", price: 69.99, salePrice: 54.99, categoryId: subcats.bebelusi[2].id, featured: true, description: "Pijamale cu print de iepuras." },
    // Bebelusi - Sosete
    { name: "Pata Picioare", slug: "pata-picioare", price: 29.99, categoryId: subcats.bebelusi[3].id, description: "Pata din lana moale." },

    // Accesorii - Palarii
    { name: "Palarie de Soare", slug: "palarie-de-soare", price: 39.99, categoryId: subcats.accesorii[0].id, description: "Palarie cu bor larg, protectie solara." },
    // Accesorii - Rucsacuri
    { name: "Rucsac Mini", slug: "rucsac-mini", price: 54.99, categoryId: subcats.accesorii[1].id, description: "Rucsac pentru gradinita." },
    // Accesorii - Esarfe
    { name: "Esarf Colorata", slug: "esarfa-colorata", price: 24.99, categoryId: subcats.accesorii[3].id, description: "Esarfa din matase naturala." },
    // Accesorii - Sosete
    { name: "Set Servecele", slug: "set-servetele", price: 34.99, salePrice: 27.99, categoryId: subcats.accesorii[2].id, description: "5 servecele asortate din bumbac." },
  ];

  const sizeMap: Record<string, string[]> = {
    "fete-rochite": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "fete-bluzite": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "fete-fuste": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "fete-pantaloni": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "fete-hanorace": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "fete-seturi": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-tricouri": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-pantaloni": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-hanorace": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-camasi": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-seturi": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "baieti-pijamale": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani", "10-11 ani"],
    "bebelusi-body": ["0-3 luni", "3-6 luni", "6-12 luni", "12-18 luni", "18-24 luni"],
    "bebelusi-salopete": ["0-3 luni", "3-6 luni", "6-12 luni", "12-18 luni", "18-24 luni"],
    "bebelusi-pijamale": ["0-3 luni", "3-6 luni", "6-12 luni", "12-18 luni", "18-24 luni"],
    "bebelusi-sosete": ["0-3 luni", "3-6 luni", "6-12 luni", "12-18 luni", "18-24 luni"],
    "bebelusi-seturi": ["0-3 luni", "3-6 luni", "6-12 luni", "12-18 luni", "18-24 luni"],
    "accesorii-sepci": ["UNIC"],
    "accesorii-geanti": ["UNIC"],
    "accesorii-sosete": ["2-3 ani", "4-5 ani", "6-7 ani", "8-9 ani"],
    "accesorii-esarfe": ["UNIC"],
  };

  // Get slug for each subcategory
  const allSubcats = [...subcats.fete, ...subcats.baieti, ...subcats.bebelusi, ...subcats.accesorii];
  const subcatSlugMap = new Map(allSubcats.map((c) => [c.id, c.slug]));

  for (const p of products) {
    const catSlug = subcatSlugMap.get(p.categoryId) || "UNIC";
    const sizes = sizeMap[catSlug] || ["UNIC"];

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice ?? null,
        description: p.description,
        featured: p.featured ?? false,
        categoryId: p.categoryId,
        images: JSON.stringify([]),
        sizes: {
          create: sizes.map((label) => ({
            label,
            stock: Math.floor(Math.random() * 30) + 5,
          })),
        },
      },
    });
  }
  console.log("Products:", products.length);
  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
