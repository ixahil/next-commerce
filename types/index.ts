import {
  Product,
  ProductImages,
  ProductOption,
  ProductVariant,
} from "@prisma/client";

export type Cart = {
  items: CartItem[];
  totalAmount: number;
};

export type CartItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  subTotal: number;
  sku: string;
  variantTitle: string;
  quantity: number;
  image: string;
};

export interface ProductWithVariant extends Product {
  variants: ProductVariant[];
}

export interface ProductWithAll extends Product {
  variants: ProductVariant[];
  images: ProductImages[];
  options: ProductOption[];
}

// export interface ProductWithAll extends Product {
//   variants: ProductVariant[];
//   images: ProductImages[];
// }

export interface ProductByCollection {
  name: string;
  slug: string;
  description: string | null;
  products: ProductWithAll[];
}

// export type Money = {
//   amount: string;
//   currencyCode: string;
// };

// export type SEO = {
//   title: string;
//   description: string;
// };

// export type Image = {
//   url: string;
//   altText: string;
//   width: number;
//   height: number;
// };

// export type MenuItem = {
//   title: string;
//   path: string;
// };

// export type Menu = MenuItem[];

// export type CartItem = {
//   id: string | undefined;
//   quantity: number;
//   cost: {
//     totalAmount: Money;
//   };
// };

// export type ProductVariant = {
//   id: string;
//   title: string;
//   availableForSale: boolean;
//   selectedOptions: {
//     name: string;
//     value: string;
//   }[];
//   price: Money;
// };

// export type ProductOption = {
//   id: string;
//   name: string;
//   values: string[];
// };

// export type Product = {
//   id: string;
//   handle: string;
//   availableForSale: boolean;
//   title: string;
//   description: string;
//   descriptionHtml: string;
//   options: ProductOption[];
//   priceRange: {
//     maxVariantPrice: Money;
//     minVariantPrice: Money;
//   };
//   variants: ProductVariant[]; // CUSTOM
//   featuredImage: Image;
//   images: Image[]; // CUSTOM
//   seo: SEO;
//   tags: string[];
//   updatedAt: string;
// };

// export type Cart = {
//   lines: CartItem[];
//   id: string | undefined;
//   checkoutUrl: string;
//   cost: {
//     subtotalAmount: Money;
//     totalAmount: Money;
//     totalTaxAmount: Money;
//   };
//   totalQuantity: number;
// };
