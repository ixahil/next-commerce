"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartIcon from "../icons/cart";
import { CartContent } from "./cart-content";
import { useCart } from "./cart-context";

export default function CartModal() {
  const { isCartOpen, cart, toggleCart } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetTrigger>
        <CartIcon quantity={cart.items.length} />
      </SheetTrigger>
      <SheetContent
        aria-description="cart-sheet"
        className="p-6 bg-wite dark:bg-black border-slate-700"
      >
        <SheetHeader>
          <SheetTitle aria-describedby="cart" asChild>
            <p className="text-lg font-semibold">My Cart</p>
          </SheetTitle>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}
