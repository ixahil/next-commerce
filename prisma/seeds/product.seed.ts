import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

import { parse } from "csv-parse";
import { once } from "node:events";
import fs from "node:fs";
const unslugify = (slug: string) => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

type ProductCSVRecord = {
  ID: "8384840892594";
  Handle: "heat-shrink";
  Command: "MERGE";
  Title: "Heat Shrink";
  "Body HTML": string;
  Vendor: "Vertex Marine";
  Type: "";
  Tags: "electrical, eligiblefordiscount, marine-connectors-lugs";
  "Tags Command": "REPLACE";
  "Created At": "2024-12-24 08:00:46 -0800";
  "Updated At": "2025-01-14 21:57:37 -0800";
  Status: "Active";
  Published: "TRUE";
  "Published At": "2024-12-24 08:00:47 -0800";
  "Published Scope": "global";
  "Template Suffix": "";
  "Gift Card": "FALSE";
  URL: "https://www.harbourchandler.ca/products/heat-shrink";
  "Total Inventory Qty": "3879";
  "Row #": "1718";
  "Top Row": "";
  "Category: ID": "";
  "Category: Name": "";
  Category: "";
  "Custom Collections": "electrical, marine-connectors-lugs, eligiblefordiscount";
  "Smart Collections": "";
  "Image Type": "";
  "Image Src": "";
  "Image Command": "";
  "Image Position": "";
  "Image Width": "";
  "Image Height": "";
  "Image Alt Text": "";
  "Variant Inventory Item ID": "46946983444658";
  "Variant ID": "45006769815730";
  "Variant Command": "MERGE";
  "Option1 Name": "Size";
  "Option1 Value": '1/2"';
  "Option2 Name": "Colour";
  "Option2 Value": "Yellow";
  "Option3 Name": "";
  "Option3 Value": "";
  "Variant Position": "15";
  "Variant SKU": "81956";
  "Variant Barcode": "910000000000";
  "Variant Image": "";
  "Variant Weight": "0";
  "Variant Weight Unit": "kg";
  "Variant Price": "3.00";
  "Variant Compare At Price": "3.00";
  "Variant Taxable": "TRUE";
  "Variant Tax Code": "";
  "Variant Inventory Tracker": "shopify";
  "Variant Inventory Policy": "deny";
  "Variant Fulfillment Service": "manual";
  "Variant Requires Shipping": "TRUE";
  "Variant Inventory Qty": "20";
  "Variant Inventory Adjust": "0";
};

export async function seedProductsFromFile(prisma: PrismaClient) {
  const grouped: Record<string, ProductCSVRecord[]> = {};

  const parser = fs
    .createReadStream("import-shop.csv")
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  parser.on("data", (record: ProductCSVRecord) => {
    const handle = record.Handle;
    if (!grouped[handle]) grouped[handle] = [];
    grouped[handle].push(record);
  });

  await once(parser, "end");

  for (const [, records] of Object.entries(grouped)) {
    const first = records[0];

    const product = await prisma.product.create({
      data: {
        basePrice: parseFloat(first["Variant Price"]),
        slug: first.Handle,
        title: first.Title,
        description: first["Body HTML"],
        isFeatured: faker.datatype.boolean(),
        status: first.Status === "Active" ? "Published" : "Draft",
      },
    });

    const variantCreates = records.map((r) =>
      prisma.productVariant.create({
        data: {
          inventory: parseInt(r["Variant Inventory Qty"] || "0"),
          price: parseFloat(r["Variant Price"] || "0"),
          sku: r["Variant SKU"],
          option1: r["Option1 Value"],
          option2: r["Option2 Value"],
          option3: r["Option3 Value"],
          title: [r["Option1 Value"], r["Option2 Value"], r["Option3 Value"]]
            .filter(Boolean)
            .join(" - "),
          productId: product.id,
        },
      })
    );

    await Promise.all(variantCreates);

    type OptionMap = Record<string, Set<string>>;

    const optionMap: OptionMap = {};

    for (const [index, r] of records.entries()) {
      // Options
      for (let i = 1; i <= 3; i++) {
        const key = `Option${i} Name` as keyof ProductCSVRecord;
        const valueKey = `Option${i} Value` as keyof ProductCSVRecord;
        const name = r[key];
        const value = r[valueKey];
        if (!name || !value) continue;
        if (!optionMap[name]) {
          optionMap[name] = new Set();
        }
        optionMap[name].add(value);
      }

      // Images
      if (r["Image Src"]) {
        await prisma.productImages.create({
          data: {
            url: r["Image Src"],
            productId: product.id,
            alt: r["Image Alt Text"],
            isFeatured: index === 0,
          },
        });
      }

      // Collections
      const collectionSlugs = new Set(
        r["Custom Collections"]
          .split(",")
          .map((c) => slugify(c.trim(), { lower: true }))
          .filter(Boolean)
      );

      for (const slug of collectionSlugs) {
        const savedCollection = await prisma.collection.upsert({
          where: { slug },
          update: {},
          create: {
            name: unslugify(slug),
            slug,
          },
        });

        const exists = await prisma.productCollection.findUnique({
          where: {
            productId_collectionId: {
              productId: product.id,
              collectionId: savedCollection.id,
            },
          },
        });

        if (!exists) {
          await prisma.productCollection.create({
            data: {
              productId: product.id,
              collectionId: savedCollection.id,
            },
          });
        }
      }
    }

    for (const [name, valuesSet] of Object.entries(optionMap)) {
      await prisma.productOption.create({
        data: {
          name,
          values: Array.from(valuesSet),
          productId: product.id,
        },
      });
    }

    console.log(
      `Created product: ${product.title} with ${records.length} variants`
    );
  }
}

// export async function seedProducts(prisma: PrismaClient, count = 10) {
//   const STATIC_IMAGES = [
//     "/images/bag.avif",
//     "/images/cup.avif",
//     "/images/tshirt.avif",
//   ];

//   const collections = faker.helpers
//     .uniqueArray(faker.commerce.department, count)
//     .map((name) => ({
//       name,
//       slug: slugify(name, { lower: true }),
//     }));

//   const createdCollections = await Promise.all(
//     collections.map((collection) =>
//       prisma.collection.upsert({
//         where: { slug: collection.slug },
//         update: {},
//         create: collection,
//       })
//     )
//   );

//   for (let i = 0; i < count; ++i) {
//     // create product

//     const title = faker.commerce.productName();

//     const randomCollections = faker.helpers.arrayElements(
//       createdCollections,
//       faker.number.int({ min: 1, max: 3 })
//     );

//     const product = await prisma.product.create({
//       data: {
//         title: title,
//         description: faker.commerce.productDescription(),
//         slug: slugify(title, { lower: true }),
//         isFeatured: faker.datatype.boolean(),
//         basePrice: parseFloat(
//           faker.commerce.price({ min: 10, max: 100, dec: 2 })
//         ),
//         collections: {
//           create: randomCollections.map((collection) => ({
//             collection: { connect: { id: collection.id } }, // Correct way to connect many-to-many
//           })),
//         },
//       },
//     });

//     // create images

//     // Assign images to product
//     await prisma.productImages.create({
//       data: {
//         productId: product.id,
//         url: faker.helpers.arrayElement(STATIC_IMAGES),
//         alt: `Image for ${title}`,
//         isFeatured: true,
//       },
//     });

//     // create product options

//     const productOptionNames = ["Size", "Color"];

//     const colorValues = ["Red", "Blue", "Green", "Cyan", "Yellow"];
//     const sizeValues = ["Small", "Medium", "Large", "XL", "XXL", "XXXL"];

//     await Promise.all(
//       productOptionNames.map((opt) =>
//         prisma.productOption.create({
//           data: {
//             productId: product.id,
//             name: opt,
//             values: opt === "Size" ? sizeValues : colorValues,
//           },
//         })
//       )
//     );

//     for (const color of colorValues) {
//       for (const size of sizeValues) {
//         await prisma.productVariant.create({
//           data: {
//             productId: product.id,
//             title: `${color} - ${size}`,
//             price: parseFloat(
//               faker.commerce.price({ min: 10, max: 100, dec: 2 })
//             ),
//             sku: faker.string.alphanumeric(8),
//             option1: color,
//             option2: size,
//             inventory: faker.number.int({ min: 0, max: 100 }),
//           },
//         });
//       }
//     }
//   }

//   console.log(`Total ${count} products seeded`);
// }
