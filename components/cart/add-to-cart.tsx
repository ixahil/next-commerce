"use client";

import { CartItem, ProductWithAll } from "@/types";
import { ProductVariant } from "@prisma/client";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";
import { useCart } from "./cart-context";
import { useMemo } from "react";

function AddButton({
  cartItem,
  disabled,
}: {
  cartItem: CartItem;
  disabled: boolean;
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(cartItem)}
      aria-label="Add to cart"
      disabled={disabled}
      className={clsx(
        "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white",
        {
          "bg-blue-600 hover:opacity-90": !disabled,
          "cursor-not-allowed opacity-60 hover:opacity-60": disabled,
        }
      )}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  product,
  variant,
}: {
  variant?: ProductVariant | null;
  product?: ProductWithAll | null;
}) {
  const cartItem = useMemo(() => {
    if (!product || !variant) return undefined;

    return {
      id: variant.id,
      image: product.images?.[0]?.url || "",
      title: product.title,
      price: variant.price,
      sku: variant.sku,
      quantity: 1,
      variantTitle: variant.title,
      slug: product.slug,
      subTotal: variant.price,
    } satisfies CartItem;
  }, [product, variant]);

  const isDisabled = !cartItem;

  return (
    <AddButton cartItem={cartItem ?? ({} as CartItem)} disabled={isDisabled} />
  );
}
