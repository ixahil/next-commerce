"use client";

import { CartItem } from "@/types";
import { XIcon } from "lucide-react";
import { useCart } from "./cart-context";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();
  return (
    <>
      <button
        onClick={() => removeFromCart(item.id)}
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
    </>
  );
}
