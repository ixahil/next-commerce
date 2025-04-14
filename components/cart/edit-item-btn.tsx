"use client";

import { CartItem } from "@/types";
import { useCart } from "./cart-context";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const { updateCartItem } = useCart();

  const handleEditItem = () => {
    updateCartItem(item.id, type);
  };

  return (
    <button
      type="submit"
      onClick={handleEditItem}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
