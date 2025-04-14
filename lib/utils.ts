import { Cart, CartItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes("[") ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them."
    );
  }
};

export const getCartTotal = (cartItems: CartItem[]) => {
  const total = cartItems.reduce((acc, item) => acc + item.subTotal, 0);
  return total;
};

// export const incrementCart = (cart: Cart, itemIndex: number) => {
//   const item = cart.items[itemIndex];

//   item.quantity += 1;
//   item.subTotal = item.price * item.quantity;
//   cart.totalAmount = getCartTotal(cart.items);

//   cart.items[itemIndex] = item;

//   return cart;
// };

export const incrementCart = (cart: Cart, itemIndex: number): Cart => {
  const updatedItems = [...cart.items];
  const item = { ...updatedItems[itemIndex] };

  item.quantity += 1;
  item.subTotal = item.price * item.quantity;

  updatedItems[itemIndex] = item;

  return {
    ...cart,
    items: updatedItems,
    totalAmount: getCartTotal(updatedItems),
  };
};

export const decrementCart = (cart: Cart, itemIndex: number): Cart => {
  const currentItem = cart.items[itemIndex];

  if (!currentItem) return cart;

  // If quantity becomes 1, and we're decrementing → remove the item
  if (currentItem.quantity === 1) {
    const filteredItems = cart.items.filter((_, index) => index !== itemIndex);
    return {
      ...cart,
      items: filteredItems,
      totalAmount: getCartTotal(filteredItems),
    };
  }

  // Otherwise, update the item
  const updatedItem = {
    ...currentItem,
    quantity: currentItem.quantity - 1,
    subTotal: currentItem.price * (currentItem.quantity - 1),
  };

  const updatedItems = [...cart.items];
  updatedItems[itemIndex] = updatedItem;

  return {
    ...cart,
    items: updatedItems,
    totalAmount: getCartTotal(updatedItems),
  };
};
