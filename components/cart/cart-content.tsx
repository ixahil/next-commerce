import React from "react";
import { useCart } from "./cart-context";
import { ShoppingCartIcon } from "lucide-react";
import { DeleteItemButton } from "./delete-item-btn";
import Image from "next/image";
import Link from "next/link";
import Price from "../ui/price";
import { EditItemQuantityButton } from "./edit-item-btn";

export const CartContent = () => {
  const { cart, toggleCart } = useCart();

  return !cart || cart.items.length === 0 ? (
    <div className="mt-20 flex w-full flex-col items-center justify-center">
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  ) : (
    <div className="flex h-full flex-col justify-between p-1">
      <ul className="grow py-4">
        {cart.items
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item, i) => {
            return (
              <li
                key={i}
                className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-1 -mt-2">
                    <DeleteItemButton item={item} />
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={item.title}
                        src={item.image}
                      />
                    </div>
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={toggleCart}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">{item.title}</span>
                        {item.title !== item.variantTitle ? (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {item.variantTitle}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right text-sm"
                      amount={item.subTotal}
                      currencyCode={"USD"}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <EditItemQuantityButton item={item} type="minus" />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">{item.quantity}</span>
                      </p>
                      <EditItemQuantityButton item={item} type="plus" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
          <p>Taxes</p>
          <Price
            className="text-right text-base text-black dark:text-white"
            amount={0}
            currencyCode={"USD"}
          />
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Shipping</p>
          <p className="text-right">Calculated at checkout</p>
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Total</p>
          <Price
            className="text-right text-base text-black dark:text-white"
            amount={cart.totalAmount}
            currencyCode={"USD"}
          />
        </div>
      </div>
      <CheckoutButton />
    </div>
  );
};

function CheckoutButton() {
  return (
    <button
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
      type="submit"
    >
      {"Proceed to Checkout"}
    </button>
  );
}
