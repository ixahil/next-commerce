"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Collection } from "@prisma/client";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  menu: Collection[];
};

export default function MobileMenu({ menu }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>
      <Sheet open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <SheetHeader className="hidden">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <SheetContent side="left" className="bg-white dark:bg-black w-52">
          <ul className="flex flex-col items-center justify-between overflow-auto gap-4 py-16">
            {menu.map((item: Collection) => (
              <li key={item.name}>
                <Link
                  href={`/collections/${item.slug}`}
                  prefetch
                  className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}
