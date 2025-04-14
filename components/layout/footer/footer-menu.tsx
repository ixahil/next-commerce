"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = {
  name: string;
  slug: string;
};

export function FooterMenuItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.slug);

  useEffect(() => {
    setActive(pathname === item.slug);
  }, [pathname, item.slug]);

  return (
    <li>
      <Link
        href={item.slug}
        className={clsx(
          "block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300",
          {
            "text-black dark:text-neutral-300": active,
          }
        )}
      >
        {item.name}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Item[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Item) => {
          return <FooterMenuItem key={item.name} item={item} />;
        })}
      </ul>
    </nav>
  );
}
