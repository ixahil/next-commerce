import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  sku: z.string(),
  variantTitle: z.string(),
  image: z.string(),
  price: z.number(),
  quantity: z.number(),
  subTotal: z.number(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  totalAmount: z.number(),
});
