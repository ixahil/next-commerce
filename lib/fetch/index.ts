import { ProductByCollection, ProductWithAll } from "@/types";
import { Collection } from "@prisma/client";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { TAGS } from "../constants";
import { prisma } from "../prisma";

export async function getMenu(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return await prisma.collection.findMany();
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<ProductWithAll[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return await prisma.product.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      variants: true,
      images: true,
      options: true,
    },
    ...getSortObject(sortKey, reverse),
  });
}

export async function getProduct(slug: string): Promise<ProductWithAll | null> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const product = await prisma.product.findFirst({
    where: {
      slug: slug,
    },
    include: {
      images: true,
      variants: true,
      options: true,
    },
  });

  return product;
}

export async function getProductsByCollection(
  collection: string
): Promise<ProductByCollection | null> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const collectionProducts = await prisma.collection.findFirst({
    where: {
      slug: collection,
      status: "Published",
    },

    select: {
      name: true,
      slug: true,
      description: true,
      products: {
        select: {
          product: {
            include: {
              images: true,
              variants: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!collectionProducts) return null;

  return {
    name: collectionProducts.name,
    slug: collectionProducts.slug,
    description: collectionProducts.description,
    products: collectionProducts.products.map(({ product }) => product),
  };
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<ProductWithAll[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const products = await prisma.product.findMany({
    where: {
      collections: {
        some: {
          collection: {
            slug: collection,
          },
        },
      },
    },
    include: {
      images: true,
      variants: true,
      options: true,
    },
    ...getSortObject(sortKey, reverse),
  });

  return products;
}

export async function getCollections(): Promise<
  { title: string; path: string }[]
> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const collections = await prisma.collection.findMany({
    where: {
      status: "Published",
    },
  });

  return collections.map((coll) => ({ title: coll.name, path: coll.slug }));
}

const getSortObject = (
  sortKey: string | undefined,
  reverse: boolean | undefined
) => {
  const direction = reverse ? "desc" : "asc";

  const sortField = (() => {
    switch (sortKey) {
      case "CREATED_AT":
        return "createdAt";
      case "PRICE":
        return "basePrice";
      default:
        return "createdAt";
    }
  })();

  return {
    orderBy: {
      [sortField]: direction,
    },
  };
};
